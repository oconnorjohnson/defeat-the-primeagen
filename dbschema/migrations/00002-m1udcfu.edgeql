CREATE MIGRATION m1udcfuuecjrvxopy3esszluvwzobstxnq7sinzcbsjon5dhquuv4q
    ONTO m1zy5ewhgd6h3jwalsm2vsiijldu6idena5tfjen24tk5vfibfnesq
{
  CREATE TYPE default::Achievements {
      CREATE PROPERTY arch: std::bool {
          SET default := false;
      };
      CREATE PROPERTY back_door_wang: std::bool {
          SET default := false;
      };
      CREATE PROPERTY big_influencer_money: std::bool {
          SET default := false;
      };
      CREATE PROPERTY brazil_mentioned: std::bool {
          SET default := false;
      };
      CREATE PROPERTY deez_nuts: std::bool {
          SET default := false;
      };
      CREATE PROPERTY falcore_mentioned: std::bool {
          SET default := false;
      };
      CREATE PROPERTY five_dollars_a_month: std::bool {
          SET default := false;
      };
      CREATE PROPERTY four_twenty: std::bool {
          SET default := false;
      };
      CREATE PROPERTY functional_programming_tye_dye: std::bool {
          SET default := false;
      };
      CREATE PROPERTY furries: std::bool {
          SET default := false;
      };
      CREATE PROPERTY giga_chad: std::bool {
          SET default := false;
      };
      CREATE PROPERTY got_the_w: std::bool {
          SET default := false;
      };
      CREATE PROPERTY hackerman: std::bool {
          SET default := false;
      };
      CREATE PROPERTY l_take: std::bool {
          SET default := false;
      };
      CREATE PROPERTY netflix_btw: std::bool {
          SET default := false;
      };
      CREATE PROPERTY o_camel_mentioned: std::bool {
          SET default := false;
      };
      CREATE PROPERTY oop: std::bool {
          SET default := false;
      };
      CREATE PROPERTY react_andy: std::bool {
          SET default := false;
      };
      CREATE PROPERTY rust_mentioned: std::bool {
          SET default := false;
      };
      CREATE PROPERTY sixty_nine: std::bool {
          SET default := false;
      };
      CREATE PROPERTY skill_issues: std::bool {
          SET default := false;
      };
      CREATE PROPERTY toms_a_genius: std::bool {
          SET default := false;
      };
      CREATE PROPERTY zig_mentioned: std::bool {
          SET default := false;
      };
  };
  ALTER TYPE default::User {
      CREATE LINK achievments: default::Achievements;
  };
  CREATE TYPE default::Stats {
      CREATE PROPERTY enemies_collided_with: std::int32;
      CREATE PROPERTY enemies_missed: std::int32;
      CREATE PROPERTY friendlies_collided_with: std::int32;
      CREATE PROPERTY laser_count: std::int16;
  };
  ALTER TYPE default::User {
      CREATE LINK stats: default::Stats;
  };
};
