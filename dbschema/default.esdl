
using extension auth; 

module default {

    global current_user := (
    assert_single((
      select User { id, name }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

    type User {
        required name: str;
        required email: str;
        multi stats: Stat;
        multi achievements: Achievement;
        required identity: ext::auth::Identity;
    }

    type Achievement {
        required name: str;
    }

    type Stat {
        required name: str;
        required number: int32 { default := 0 }
    }

}
