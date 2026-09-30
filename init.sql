CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO tasks (title, done) VALUES
  ('Learn Express', TRUE),
  ('Build CRUD API', FALSE),
  ('Publish to GitHub', FALSE);