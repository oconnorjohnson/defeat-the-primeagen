CREATE MIGRATION m1zy5ewhgd6h3jwalsm2vsiijldu6idena5tfjen24tk5vfibfnesq
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE PROPERTY email: std::str;
      CREATE PROPERTY username: std::str;
  };
};
