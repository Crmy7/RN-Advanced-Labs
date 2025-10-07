import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db';
import { Robot, RobotType } from '../types/robot';

/**
 * Interface pour les données d'entrée d'un robot (sans id ni timestamps)
 */
export interface RobotInput {
  name: string;
  label: string;
  year: number;
  type: RobotType;
}

/**
 * Interface pour les mises à jour partielles d'un robot
 */
export interface RobotUpdate {
  name?: string;
  label?: string;
  year?: number;
  type?: RobotType;
  archived?: boolean;
}

/**
 * Options pour la liste des robots
 */
export interface ListRobotsOptions {
  q?: string;           // Recherche par nom
  sort?: 'name' | 'year' | 'created_at';
  order?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
  includeArchived?: boolean;
}

/**
 * Résultat de la liste paginée
 */
export interface PaginatedRobots {
  robots: Robot[];
  total: number;
  hasMore: boolean;
}

/**
 * Repository pour gérer les opérations CRUD sur les robots
 */
class RobotRepository {
  /**
   * Vérifie si la colonne archived existe
   */
  private async hasArchivedColumn(): Promise<boolean> {
    const db = getDatabase();
    try {
      const columns = await db.getAllAsync<{ name: string }>(
        'PRAGMA table_info(robots)'
      );
      return columns.some((col) => col.name === 'archived');
    } catch {
      return false;
    }
  }

  /**
   * Crée un nouveau robot
   */
  async create(input: RobotInput): Promise<Robot> {
    const db = getDatabase();
    const id = uuidv4();
    const now = Date.now();

    try {
      // Vérifier l'unicité du nom
      const existing = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM robots WHERE LOWER(name) = LOWER(?)',
        [input.name]
      );

      if (existing && existing.count > 0) {
        throw new Error(`Un robot avec le nom "${input.name}" existe déjà`);
      }

      // Vérifier si la colonne archived existe
      const hasArchived = await this.hasArchivedColumn();

      // Insérer le robot (avec ou sans archived selon la version)
      if (hasArchived) {
        await db.runAsync(
          `INSERT INTO robots (id, name, label, year, type, created_at, updated_at, archived)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
          [id, input.name, input.label, input.year, input.type, now, now]
        );
      } else {
        await db.runAsync(
          `INSERT INTO robots (id, name, label, year, type, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, input.name, input.label, input.year, input.type, now, now]
        );
      }

      // Retourner le robot créé
      const robot = await this.getById(id);
      if (!robot) {
        throw new Error('Erreur lors de la création du robot');
      }

      console.log('[ROBOT] Robot créé:', robot.name);
      return robot;
    } catch (error) {
      console.error('[ERREUR] Création du robot:', error);
      throw error;
    }
  }

  /**
   * Récupère un robot par son ID
   */
  async getById(id: string): Promise<Robot | null> {
    const db = getDatabase();

    try {
      const robot = await db.getFirstAsync<Robot>(
        'SELECT * FROM robots WHERE id = ?',
        [id]
      );

      return robot || null;
    } catch (error) {
      console.error('[ERREUR] Récupération du robot:', error);
      throw error;
    }
  }

  /**
   * Met à jour un robot
   */
  async update(id: string, updates: RobotUpdate): Promise<Robot> {
    const db = getDatabase();
    const now = Date.now();

    try {
      // Récupérer le robot existant
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error(`Robot avec l'ID ${id} introuvable`);
      }

      // Vérifier l'unicité du nom si modifié
      if (updates.name && updates.name !== existing.name) {
        const duplicate = await db.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) as count FROM robots WHERE LOWER(name) = LOWER(?) AND id != ?',
          [updates.name, id]
        );

        if (duplicate && duplicate.count > 0) {
          throw new Error(`Un robot avec le nom "${updates.name}" existe déjà`);
        }
      }

      // Construire la requête de mise à jour
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.name !== undefined) {
        fields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.label !== undefined) {
        fields.push('label = ?');
        values.push(updates.label);
      }
      if (updates.year !== undefined) {
        fields.push('year = ?');
        values.push(updates.year);
      }
      if (updates.type !== undefined) {
        fields.push('type = ?');
        values.push(updates.type);
      }
      if (updates.archived !== undefined) {
        fields.push('archived = ?');
        values.push(updates.archived ? 1 : 0);
      }

      // Toujours mettre à jour updated_at
      fields.push('updated_at = ?');
      values.push(now);

      // Ajouter l'ID à la fin
      values.push(id);

      await db.runAsync(
        `UPDATE robots SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      // Retourner le robot mis à jour
      const updated = await this.getById(id);
      if (!updated) {
        throw new Error('Erreur lors de la mise à jour du robot');
      }

      console.log('[ROBOT] Robot mis à jour:', updated.name);
      return updated;
    } catch (error) {
      console.error('[ERREUR] Mise à jour du robot:', error);
      throw error;
    }
  }

  /**
   * Supprime un robot (hard delete)
   */
  async remove(id: string): Promise<void> {
    const db = getDatabase();

    try {
      const robot = await this.getById(id);
      if (!robot) {
        throw new Error(`Robot avec l'ID ${id} introuvable`);
      }

      await db.runAsync('DELETE FROM robots WHERE id = ?', [id]);
      console.log('[ROBOT] Robot supprimé:', robot.name);
    } catch (error) {
      console.error('[ERREUR] Suppression du robot:', error);
      throw error;
    }
  }

  /**
   * Archive un robot (soft delete)
   */
  async archive(id: string): Promise<Robot> {
    return this.update(id, { archived: true });
  }

  /**
   * Désarchive un robot
   */
  async unarchive(id: string): Promise<Robot> {
    return this.update(id, { archived: false });
  }

  /**
   * Liste les robots avec filtres, tri et pagination
   */
  async list(options: ListRobotsOptions = {}): Promise<PaginatedRobots> {
    const db = getDatabase();
    const {
      q = '',
      sort = 'name',
      order = 'ASC',
      limit = 100,
      offset = 0,
      includeArchived = false,
    } = options;

    try {
      // Vérifier si la colonne archived existe
      const hasArchived = await this.hasArchivedColumn();

      // Construction de la requête de base
      let whereClause = '1=1';
      if (hasArchived && !includeArchived) {
        whereClause = 'archived = 0';
      }
      const params: any[] = [];

      // Recherche par nom
      if (q) {
        whereClause += ' AND LOWER(name) LIKE LOWER(?)';
        params.push(`%${q}%`);
      }

      // Récupérer le nombre total
      const totalResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM robots WHERE ${whereClause}`,
        params
      );
      const total = totalResult?.count || 0;

      // Récupérer les robots avec tri et pagination
      const robots = await db.getAllAsync<Robot>(
        `SELECT * FROM robots 
         WHERE ${whereClause} 
         ORDER BY ${sort} ${order}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      );

      return {
        robots: robots || [],
        total,
        hasMore: offset + (robots?.length || 0) < total,
      };
    } catch (error) {
      console.error('[ERREUR] Récupération des robots:', error);
      throw error;
    }
  }

  /**
   * Compte le nombre total de robots
   */
  async count(includeArchived = false): Promise<number> {
    const db = getDatabase();

    try {
      // Vérifier si la colonne archived existe
      const hasArchived = await this.hasArchivedColumn();
      
      let whereClause = '1=1';
      if (hasArchived && !includeArchived) {
        whereClause = 'archived = 0';
      }
      
      const result = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM robots WHERE ${whereClause}`
      );

      return result?.count || 0;
    } catch (error) {
      console.error('[ERREUR] Comptage des robots:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les robots (pour export)
   */
  async getAll(): Promise<Robot[]> {
    const db = getDatabase();

    try {
      const robots = await db.getAllAsync<Robot>(
        'SELECT * FROM robots ORDER BY name ASC'
      );

      return robots || [];
    } catch (error) {
      console.error('[ERREUR] Récupération de tous les robots:', error);
      throw error;
    }
  }

  /**
   * Supprime tous les robots (pour réinitialisation)
   */
  async deleteAll(): Promise<void> {
    const db = getDatabase();

    try {
      await db.runAsync('DELETE FROM robots');
      console.log('[ROBOT] Tous les robots ont été supprimés');
    } catch (error) {
      console.error('[ERREUR] Suppression de tous les robots:', error);
      throw error;
    }
  }

  /**
   * Importe des robots en masse
   */
  async importRobots(robots: RobotInput[]): Promise<number> {
    let count = 0;

    try {
      for (const robot of robots) {
        try {
          await this.create(robot);
          count++;
        } catch (error) {
          console.warn(`⚠️ Impossible d'importer le robot "${robot.name}":`, error);
        }
      }

      console.log(`✅ ${count}/${robots.length} robots importés`);
      return count;
    } catch (error) {
      console.error('❌ Erreur lors de l\'importation des robots:', error);
      throw error;
    }
  }
}

// Singleton
export const robotRepo = new RobotRepository();

