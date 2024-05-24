CREATE MIGRATION m1bsiasnkxsc435smtelhsqjzboh5aaaeu26p4yuajjxrcclvlc56a
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE TYPE default::Achievement {
      CREATE REQUIRED PROPERTY arch: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY back_door_wang: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY big_influencer_money: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY brazil_mentioned: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY chad_stack: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY deez_nuts: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY devon: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY falcore_mentioned: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY five_dollars_a_month: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY four_twenty: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY functional_programming_plus_tye_dye: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY furries: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY giga_chad: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY got_the_w: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY hackerman: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY in_shambles: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY l_take: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY netflix_btw: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY ocamel_mentioned: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY react_andy: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY real_talk: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY rust_mentioned: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY sixty_nine: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY skill_issues: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY squeel: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY tom_s_a_genius: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY zig_mentioned: std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::Stat {
      CREATE REQUIRED PROPERTY enemies_collisions: std::int32 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY enemies_missed: std::int32 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY friendly_collisions: std::int32 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY lasers_shot: std::int32 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY score: std::int32 {
          SET default := 0;
      };
      CREATE REQUIRED PROPERTY total_game_time: std::int64 {
          SET default := 0;
      };
  };
  CREATE TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE LINK achievements: default::Achievement {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE LINK stats: default::Stat {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
