module default {

    type User {
        required username: str;
        required email: str;
        multi stats: Stat;
        multi achievements: Achievement;
    }

    type Achievement {
        required name: str;
    }

    type Stat {
        required name: str;
        required number: int32 { default := 0 }
    }

}
