
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
        stats: Stat { constraint exclusive };
        achievements: Achievement { constraint exclusive };
        required identity: ext::auth::Identity {
            constraint exclusive;
    };
    }

    type Achievement {
        required property deez_nuts: bool { default := false };
        required property skill_issues: bool { default := false };
        required property brazil_mentioned: bool { default := false };
        required property ocamel_mentioned: bool { default := false };
        required property rust_mentioned: bool { default := false };
        required property giga_chad: bool { default := false };
        required property chad_stack: bool { default := false };
        required property react_andy: bool { default := false };
        required property tom_s_a_genius: bool { default := false };
        required property devon: bool { default := false };
        required property functional_programming_plus_tye_dye: bool { default := false };
        required property hackerman: bool { default := false };
        required property furries: bool { default := false };
        required property squeel: bool { default := false };
        required property falcore_mentioned: bool { default := false };
        required property netflix_btw: bool { default := false };
        required property arch: bool { default := false };
        required property zig_mentioned: bool { default := false };
        required property four_twenty: bool { default := false };
        required property sixty_nine: bool { default := false };
        required property real_talk: bool { default := false };
        required property l_take: bool { default := false };
        required property got_the_w: bool { default := false };
        required property big_influencer_money: bool { default := false };
        required property back_door_wang: bool { default := false };
        required property five_dollars_a_month: bool { default := false };
        required property in_shambles: bool { default := false };
    }

    type Stat {
        required score: int32 { default := 0 };
        required enemies_collisions: int32 { default := 0 };
        required friendly_collisions: int32 { default := 0 };
        required enemies_missed: int32 { default := 0 };
        required lasers_shot: int32 { default := 0 };
        required total_game_time: int64 { default := 0 };
    }
}
