CREATE MIGRATION m1x22cxzlqn3rf7facd4vkxsgevg3xpefyfitnxknxj7d3miu5727a
    ONTO m1d422yp5yupl4tx4afhjzscwvz3zhegxnvgf2yiuu42rchejlacsa
{
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
