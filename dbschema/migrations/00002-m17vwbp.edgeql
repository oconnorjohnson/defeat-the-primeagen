CREATE MIGRATION m17vwbp73pwoage4xduru45k5rkgrwtjttndfbngdk6kxvyj7we2zq
    ONTO m1bsiasnkxsc435smtelhsqjzboh5aaaeu26p4yuajjxrcclvlc56a
{
  ALTER TYPE default::Stat {
      ALTER PROPERTY enemies_collisions {
          RENAME TO enemies_shot_down;
      };
  };
  ALTER TYPE default::Stat {
      ALTER PROPERTY enemies_missed {
          RENAME TO enemy_collisions;
      };
  };
  ALTER TYPE default::Stat {
      ALTER PROPERTY lasers_shot {
          RENAME TO friendly_misses;
      };
  };
};
