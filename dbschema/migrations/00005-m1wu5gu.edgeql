CREATE MIGRATION m1wu5gukduzkl63di7rn25vio6zsradldy7xk3qbgqctqcoz7oy4pa
    ONTO m1x7njy7bvr4kxsnefnpxs2iepnskl7btqwvlzpikddvhlxec5mhha
{
  ALTER TYPE default::Stats {
      DROP PROPERTY enemies_missed;
  };
  ALTER TYPE default::Stats {
      DROP PROPERTY friendlies_collided_with;
  };
  ALTER TYPE default::Stats {
      DROP PROPERTY laser_count;
  };
  ALTER TYPE default::Stats RENAME TO default::Stat;
  ALTER TYPE default::Stat {
      ALTER PROPERTY enemies_collided_with {
          RENAME TO number;
      };
  };
  ALTER TYPE default::Stat {
      CREATE REQUIRED PROPERTY name: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
  ALTER TYPE default::User {
      ALTER LINK stats {
          SET MULTI;
          RESET OPTIONALITY;
      };
  };
};
