CREATE MIGRATION m1r35srquia6vb27lmntcdrlepfwrbqqgscmir7lqksj3bihtf6o2q
    ONTO m1udcfuuecjrvxopy3esszluvwzobstxnq7sinzcbsjon5dhquuv4q
{
  ALTER TYPE default::Stats {
      ALTER PROPERTY enemies_collided_with {
          SET default := 0;
      };
      ALTER PROPERTY enemies_missed {
          SET default := 0;
      };
      ALTER PROPERTY friendlies_collided_with {
          SET default := 0;
      };
      ALTER PROPERTY laser_count {
          SET default := 0;
      };
  };
};
