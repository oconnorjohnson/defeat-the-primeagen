CREATE MIGRATION m1x7njy7bvr4kxsnefnpxs2iepnskl7btqwvlzpikddvhlxec5mhha
    ONTO m1r35srquia6vb27lmntcdrlepfwrbqqgscmir7lqksj3bihtf6o2q
{
  CREATE TYPE default::Achievement {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK achievements: default::Achievement;
  };
  ALTER TYPE default::Achievements {
      DROP PROPERTY arch;
      DROP PROPERTY back_door_wang;
      DROP PROPERTY big_influencer_money;
      DROP PROPERTY brazil_mentioned;
      DROP PROPERTY deez_nuts;
      DROP PROPERTY falcore_mentioned;
      DROP PROPERTY five_dollars_a_month;
      DROP PROPERTY four_twenty;
      DROP PROPERTY functional_programming_tye_dye;
      DROP PROPERTY furries;
      DROP PROPERTY giga_chad;
      DROP PROPERTY got_the_w;
      DROP PROPERTY hackerman;
      DROP PROPERTY l_take;
      DROP PROPERTY netflix_btw;
      DROP PROPERTY o_camel_mentioned;
      DROP PROPERTY oop;
      DROP PROPERTY react_andy;
      DROP PROPERTY rust_mentioned;
      DROP PROPERTY sixty_nine;
      DROP PROPERTY skill_issues;
      DROP PROPERTY toms_a_genius;
      DROP PROPERTY zig_mentioned;
  };
  ALTER TYPE default::User {
      DROP LINK achievments;
      ALTER LINK stats {
          SET REQUIRED USING (<default::Stats>{});
      };
      ALTER PROPERTY email {
          SET REQUIRED USING (<std::str>{});
      };
      ALTER PROPERTY username {
          SET REQUIRED USING (<std::str>{});
      };
  };
  DROP TYPE default::Achievements;
  ALTER TYPE default::Stats {
      ALTER PROPERTY enemies_collided_with {
          SET REQUIRED USING (<std::int32>{});
      };
      ALTER PROPERTY enemies_missed {
          SET REQUIRED USING (<std::int32>{});
      };
      ALTER PROPERTY friendlies_collided_with {
          SET REQUIRED USING (<std::int32>{});
      };
      ALTER PROPERTY laser_count {
          SET REQUIRED USING (<std::int16>{});
      };
  };
};
