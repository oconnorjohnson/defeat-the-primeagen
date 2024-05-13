CREATE MIGRATION m1iexrmbmrj4vizjgezv3otefisotrp7clh6vr6akqrrzdc35gjoea
    ONTO m1t3iojbmynnbtdxmrzfuh3oayiukfr46otc3v4dowvbglhgqnd2za
{
  ALTER TYPE default::User {
      CREATE REQUIRED LINK identity: ext::auth::Identity {
          SET REQUIRED USING (<ext::auth::Identity>{});
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY username {
          RENAME TO name;
      };
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id,
          name
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
};
