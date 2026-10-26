import type { Point, Direction, SnakeEngine } from './SnakeEngine';

// BFS 寻路 AI：贪心追食物 + 安全校验防自困，无路可走时切换为苟活模式（最大化剩余空间）
export class AutoPilot {
  public static getNextDirection(engine: SnakeEngine): Direction {
    const head = engine.snake[0];
    const food = engine.food;

    const pathToFood = this.findPath(head, food, engine);

    if (pathToFood && pathToFood.length > 0) {
      const nextDir = pathToFood[0];
      // 模拟走这一步后检查蛇头是否仍能触达蛇尾，确认不会把自己困死
      if (this.isSafeMove(head, nextDir, engine)) {
        return nextDir;
      }
    }

    // 苟活模式：优先选择能触达蛇尾的方向，其次选择剩余空间最大的方向
    const validMoves = this.getValidMoves(head, engine);
    let bestMove = engine.direction;
    let maxSpace = -1;

    for (const move of validMoves) {
      if (this.isSafeMove(head, move.dir, engine)) {
        return move.dir;
      }
      const space = this.getFreeSpaceSize(move.nextPoint, engine);
      if (space > maxSpace) {
        maxSpace = space;
        bestMove = move.dir;
      }
    }

    return bestMove;
  }

  // 模拟走一步后蛇头能否触达蛇尾——能触达说明身体不会形成封闭环路
  private static isSafeMove(head: Point, dir: Direction, engine: SnakeEngine): boolean {
    const nextPos = this.getNextPoint(head, dir, engine);
    if (!nextPos) return false;

    const simulatedSnake = [{ ...nextPos }, ...engine.snake];
    const ateFood = nextPos.x === engine.food.x && nextPos.y === engine.food.y;
    if (!ateFood) simulatedSnake.pop();

    if (this.checkCollision(nextPos, engine.snake.slice(0, -1), engine)) return false;

    const tail = simulatedSnake[simulatedSnake.length - 1];
    return this.findPath(simulatedSnake[0], tail, engine, simulatedSnake) !== null;
  }

  private static checkCollision(p: Point, snake: Point[], engine: SnakeEngine): boolean {
    if (engine.mode !== 'wrap') {
      if (p.x < 0 || p.x >= engine.canvasSize || p.y < 0 || p.y >= engine.canvasSize) return true;
    }
    return snake.some((s) => s.x === p.x && s.y === p.y);
  }

  private static findPath(
    start: Point,
    target: Point,
    engine: SnakeEngine,
    currentSnake?: Point[]
  ): Direction[] | null {
    const queue: { point: Point; path: Direction[] }[] = [{ point: start, path: [] }];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    const snakeToAvoid = currentSnake || engine.snake;
    // 避开身体但不避开尾部（尾部下一帧会移走）
    const bodySet = new Set(snakeToAvoid.slice(0, -1).map((s) => `${s.x},${s.y}`));

    while (queue.length > 0) {
      const { point, path } = queue.shift()!;

      if (point.x === target.x && point.y === target.y) {
        return path;
      }

      const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      for (const dir of dirs) {
        const nextPos = this.getNextPoint(point, dir, engine);
        if (!nextPos) continue;

        const key = `${nextPos.x},${nextPos.y}`;
        if (bodySet.has(key) || visited.has(key)) continue;

        visited.add(key);
        queue.push({
          point: nextPos,
          path: [...path, dir],
        });
      }
    }

    return null;
  }

  private static getNextPoint(p: Point, dir: Direction, engine: SnakeEngine): Point | null {
    let nx = p.x;
    let ny = p.y;
    if (dir === 'UP') ny -= engine.gridSize;
    if (dir === 'DOWN') ny += engine.gridSize;
    if (dir === 'LEFT') nx -= engine.gridSize;
    if (dir === 'RIGHT') nx += engine.gridSize;

    if (engine.mode === 'wrap') {
      if (nx < 0) nx = engine.canvasSize - engine.gridSize;
      if (nx >= engine.canvasSize) nx = 0;
      if (ny < 0) ny = engine.canvasSize - engine.gridSize;
      if (ny >= engine.canvasSize) ny = 0;
    } else {
      if (nx < 0 || nx >= engine.canvasSize || ny < 0 || ny >= engine.canvasSize) return null;
    }
    return { x: nx, y: ny };
  }

  private static getValidMoves(head: Point, engine: SnakeEngine) {
    const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const bodySet = new Set(engine.snake.slice(0, -1).map((s) => `${s.x},${s.y}`));

    return dirs
      .filter((dir) => {
        if (dir === 'UP' && engine.direction === 'DOWN') return false;
        if (dir === 'DOWN' && engine.direction === 'UP') return false;
        if (dir === 'LEFT' && engine.direction === 'RIGHT') return false;
        if (dir === 'RIGHT' && engine.direction === 'LEFT') return false;
        const nextPos = this.getNextPoint(head, dir, engine);
        if (!nextPos) return false;
        return !bodySet.has(`${nextPos.x},${nextPos.y}`);
      })
      .map((dir) => {
        const nextPoint = this.getNextPoint(head, dir, engine)!;
        return { dir, nextPoint };
      });
  }

  private static getFreeSpaceSize(start: Point, engine: SnakeEngine): number {
    const visited = new Set<string>();
    const queue: Point[] = [start];
    visited.add(`${start.x},${start.y}`);
    const bodySet = new Set(engine.snake.map((s) => `${s.x},${s.y}`));

    let count = 0;
    while (queue.length > 0) {
      const current = queue.shift()!;
      count++;
      const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
      for (const dir of dirs) {
        const next = this.getNextPoint(current, dir, engine);
        if (!next) continue;
        const key = `${next.x},${next.y}`;
        if (!visited.has(key) && !bodySet.has(key)) {
          visited.add(key);
          queue.push(next);
        }
      }
    }
    return count;
  }
}
