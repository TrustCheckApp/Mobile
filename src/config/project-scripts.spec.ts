import fs from 'fs';
import path from 'path';

describe('baseline de qualidade do projeto', () => {
  const rootDir = path.resolve(__dirname, '../..');

  it('mantem scripts reais para teste, lint e build', () => {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts?.test).toBeTruthy();
    expect(packageJson.scripts?.lint).toBeTruthy();
    expect(packageJson.scripts?.build).toBeTruthy();

    expect(packageJson.scripts?.lint).not.toMatch(/placeholder|console\.log|node\s+-e/i);
    expect(packageJson.scripts?.build).not.toMatch(/placeholder|console\.log|node\s+-e/i);
  });

  it('impede versionamento de dependencias locais', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    expect(gitignore).toMatch(/(^|\n)node_modules\/?(\n|$)/);
  });
});
