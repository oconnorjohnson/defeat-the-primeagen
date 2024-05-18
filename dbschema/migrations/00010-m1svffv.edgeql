CREATE MIGRATION m1svffvxkfai4vm7jqojssj6jhhd6srjqfdrku3u7s724ckfy7hdgq
    ONTO m1khqvg4boajgp2qnybjxc5hesdrilumuwcqqvbwt43hfg25q52k5q
{
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          DROP CONSTRAINT std::exclusive;
      };
  };
};
