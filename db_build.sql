BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL     PRIMARY KEY,
    firstname   TEXT       NOT NULL,
    lastname    TEXT       NOT NULL,
    github      TEXT       NOT NULL,
    email       TEXT       NOT NULL
);


CREATE TABLE IF NOT EXISTS topics (
  id          SMALLINT   PRIMARY KEY,
  title       TEXT       NOT NULL,
  image_path  TEXT       NOT NULL,
  endpoint    TEXT       NOT NULL
);

INSERT INTO topics(id, title, image_path, endpoint) VALUES
  (1, 'HTML & CSS', 'html_css.jpg', 'html-css'),
  (2, 'Git & Github', 'git_github.jpg', 'git-github'),
  (3, 'Command Line', 'command_line.jpg', 'command-line'),
  (4, 'DOM Mainpulation', 'DOM.jpg', 'the-dom'),
  (5, 'Testing', '.testing.jpg', 'testing'),
  (6, 'API', 'API.jpg', 'api'),
  (7, 'Node', 'node.jpg', 'node'),
  (8, 'Hapi', 'hapi.jpg', 'hapi'),
  (9, 'Handlebars', 'handlebars.jpg', 'handlebars'),
  (10, 'Databases', 'databases.jpg', 'databases'),
  (11, 'Authentication', 'authentication.jpg', 'authetication'),
  (12, 'UX & UI', 'ux_ui.jpg', 'ux-ui')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS type (
  id           SMALLINT    PRIMARY KEY,
  label        TEXT        NOT NULL
);

INSERT INTO type(id, label) VALUES
  (1, 'tutorial'),
  (2, 'article'),
  (3, 'reference'),
  (4, 'video'),
  (5, 'IDE')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS resources (
  id           SERIAL      PRIMARY KEY,
  title        TEXT        NOT NULL,
  url          TEXT        NOT NULL,
  topic_id     INTEGER     NOT NULL     REFERENCES topics(id),
  type_id      INTEGER     NOT NULL     REFERENCES type(id),
  user_id      INTEGER     NOT NULL     REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id           SERIAL      PRIMARY KEY,
  timecreated  TIMESTAMP   NOT NULL,
  rating       SMALLINT    NOT NULL     CHECK (rating > 0 AND rating < 6),
  resource_id  INTEGER     NOT NULL     REFERENCES resources(id),
  content      TEXT        NOT NULL,
  user_id      INTEGER     NOT NULL     REFERENCES users(id)
);

COMMIT;
