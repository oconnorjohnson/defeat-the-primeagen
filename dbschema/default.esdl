
using extension auth; 

module default {

    global current_user := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

    type User {
        required name: str { constraint exclusive };
        multi stats: Stat;
        multi achievements: Achievement;
        required identity: ext::auth::Identity {
            constraint exclusive;
    };
    }

    type Achievement {
        required name: str;
    }

    type Stat {
        required name: str;
        required number: int32 { default := 0 }
    }
}
