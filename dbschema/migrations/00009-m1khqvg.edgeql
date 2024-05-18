CREATE MIGRATION m1khqvg4boajgp2qnybjxc5hesdrilumuwcqqvbwt43hfg25q52k5q
    ONTO m1og2yu5e6ogmdy4zmt4lytdb7jfyn7pf5i4nnidfnbquydgp743zq
{
  ALTER TYPE default::User {
      ALTER LINK identity {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
