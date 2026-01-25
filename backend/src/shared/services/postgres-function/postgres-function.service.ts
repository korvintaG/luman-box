import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresFunctionService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  /**
   * Вызывает PostgreSQL функцию, которая возвращает строку или null
   * @param functionName - имя PostgreSQL функции
   * @param params - параметры функции (неограниченное число)
   * @returns Promise<string | null> - результат функции или null при ошибке
   */
  async callStringFunction(
    functionName: string,
    ...params: any[]
  ): Promise<string | null> {
    try {
      // Формируем плейсхолдеры для параметров ($1, $2, $3, ...)
      const placeholders = params.map((_, index) => `$${index + 1}`).join(', ');
      
      // Формируем SQL запрос
      const query = `SELECT ${functionName}(${placeholders}) as result`;
      
      // Выполняем запрос
      const result = await this.dataSource.query<{ result: string | null }[]>(
        query,
        params
      );
      
      // Возвращаем результат или null
      return result[0]?.result ?? null;
    } catch (error) {
      // При ошибке возвращаем null
      return null;
    }
  }
}

