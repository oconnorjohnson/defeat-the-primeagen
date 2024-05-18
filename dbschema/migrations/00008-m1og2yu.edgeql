CREATE MIGRATION m1og2yu5e6ogmdy4zmt4lytdb7jfyn7pf5i4nnidfnbquydgp743zq
    ONTO m1iexrmbmrj4vizjgezv3otefisotrp7clh6vr6akqrrzdc35gjoea
{
  ALTER TYPE default::User {
      DROP PROPERTY email;
  };
};
