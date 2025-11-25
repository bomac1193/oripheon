import Database from "better-sqlite3";
import { Avatar } from "../models/avatar.js";

export interface AvatarRepository {
  create(avatar: Avatar): Promise<Avatar>;
  findById(id: string): Promise<Avatar | null>;
  update(id: string, avatar: Avatar): Promise<Avatar>;
  list(limit?: number, offset?: number): Promise<Avatar[]>;
}

export class SqliteAvatarRepository implements AvatarRepository {
  constructor(private db: Database.Database) {}

  async create(avatar: Avatar): Promise<Avatar> {
    const stmt = this.db.prepare(
      `INSERT INTO avatars (id, seed, payload, created_at) VALUES (?, ?, ?, ?)`
    );
    stmt.run(avatar.id, avatar.seed, JSON.stringify(avatar), avatar.createdAt);
    return avatar;
  }

  async findById(id: string): Promise<Avatar | null> {
    const row = this.db
      .prepare(`SELECT payload FROM avatars WHERE id = ?`)
      .get(id) as { payload: string } | undefined;
    if (!row) return null;
    return JSON.parse(row.payload) as Avatar;
  }

  async update(id: string, avatar: Avatar): Promise<Avatar> {
    const stmt = this.db.prepare(
      `UPDATE avatars SET seed = ?, payload = ?, created_at = ? WHERE id = ?`
    );
    stmt.run(avatar.seed, JSON.stringify(avatar), avatar.createdAt, id);
    return avatar;
  }

  async list(limit = 20, offset = 0): Promise<Avatar[]> {
    const stmt = this.db.prepare(
      `SELECT payload FROM avatars ORDER BY created_at DESC LIMIT ? OFFSET ?`
    );
    const rows = stmt.all(limit, offset) as Array<{ payload: string }>;
    return rows.map((row) => JSON.parse(row.payload) as Avatar);
  }
}
