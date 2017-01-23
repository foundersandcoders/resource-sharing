BEGIN;

DROP TABLE IF EXISTS users, topics, type, resources, reviews;

CREATE TABLE users (
    id          SERIAL     PRIMARY KEY,
    firstname   TEXT       NOT NULL,
    lastname    TEXT       NOT NULL,
    github      TEXT       NOT NULL,
    email       TEXT       NOT NULL,
    username    TEXT       UNIQUE,
    password    TEXT       NOT NULL
);

INSERT INTO users(firstname, lastname, github, email, username, password) VALUES
  ('Jen', 'Spencer', 'jsms90', 'jen@foundersandcoders.com', 'jsms90', '$2a$10$UpA4.c39Yp09g5zZZnmeTuE7gabMK2wWeEWlM4d.uSs8iO86FZvyS');

CREATE TABLE topics (
  id          SMALLINT   PRIMARY KEY,
  title       TEXT       NOT NULL,
  image_path  TEXT       NOT NULL,
  endpoint    TEXT       UNIQUE
);

INSERT INTO topics(id, title, image_path, endpoint) VALUES
  (1, 'HTML & CSS', 'html_css.jpg', 'html-css'),
  (2, 'Git & Github', 'git_github.jpg', 'git-github'),
  (3, 'Command Line', 'command_line.jpg', 'command-line'),
  (4, 'DOM Mainpulation', 'DOM.jpg', 'the-dom'),
  (5, 'Testing', 'testing.jpg', 'testing'),
  (6, 'API', 'API.jpg', 'api'),
  (7, 'Node', 'node.jpg', 'node'),
  (8, 'Databases', 'databases.jpg', 'databases'),
  (9, 'Hapi', 'hapi.jpg', 'hapi'),
  (10, 'Handlebars', 'handlebars.jpg', 'handlebars'),
  (11, 'Authentication', 'authentication.jpg', 'authetication'),
  (12, 'UX & UI', 'ux_ui.jpg', 'ux-ui');


CREATE TABLE type (
  id           SMALLINT    PRIMARY KEY,
  label        TEXT        NOT NULL
);

INSERT INTO type(id, label) VALUES
  (1, 'tutorial'),
  (2, 'article'),
  (3, 'reference'),
  (4, 'video'),
  (5, 'IDE');


CREATE TABLE resources (
  id           SERIAL      PRIMARY KEY,
  title        TEXT        NOT NULL,
  url          TEXT        NOT NULL,
  topic_id     INTEGER     NOT NULL     REFERENCES topics(id),
  type_id      INTEGER     NOT NULL     REFERENCES type(id),
  user_id      INTEGER     NOT NULL     REFERENCES users(id),
  endpoint     TEXT        UNIQUE
);

INSERT INTO resources(title, url, topic_id, type_id, user_id, endpoint) VALUES
  ('How it feels to code Javascript in 2016', 'https://hackernoon.com/how-it-feels-to-learn-javascript-in-2016-d3a717dd577f#.lxto065k1', '1', '2', '1', 'how-it-feels-to-code-javascript-in-2016'),
  ('How to write testable JavaScript', 'https://www.youtube.com/watch?v=OzjogCFO4Zo', '5', '4', '1', 'how-to-write-testable-javascript'),
  ('Learn to code HTML & CSS', 'http://learn.shayhowe.com/html-css/', '1', '1', '1', 'learn-to-code-html--css');

CREATE TABLE reviews (
  id           SERIAL      PRIMARY KEY,
  timestamp    TIMESTAMP   DEFAULT      current_timestamp,
  rating       SMALLINT    NOT NULL     CHECK (rating > 0 AND rating < 6),
  resource_id  INTEGER     NOT NULL     REFERENCES resources(id),
  content      TEXT        NOT NULL,
  user_id      INTEGER     NOT NULL     REFERENCES users(id)
);

COMMIT;
