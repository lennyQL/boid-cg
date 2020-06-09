class Boid {
    // dm = 20; //obj ellipse diamiter

    /**
     * *Boidのコンストラクタ*
     * 
     * @param {vec2} _pos 
     *      :(POSITION x, POSITION y)
     * @param {vec2} _dir 
     *      :(RADIAN angle, FLOAT power)
     * @param {float} _range 
     *      :(DISTANCE sensor)
     * @param {float} _dm 
     *      :boidの直径
     */
    constructor(_pos, _dir, _range, _dm) {
        this.pos = _pos;
        this.vel = createVector(cos(_dir.x), sin(_dir.x)).mult(_dir.y);
        this.dir = _dir;
        this.range = _range;
        this.mates = [];
        this.acc = createVector(0, 0);
        this.ppos = this.pos; // previos position
        this.dm = _dm;

    }

    /**
     * *進行方向の設定*
     * 
     * @param {*} _d 
     * ラジアン
     * 
     */
    setDirc(_d) {
        this.dir.x = _d;
    }

    //setAcc(_x, _y) {
    //    acc.set(_x, _y);
    //}

    /**
     * *オブジェクト内部情報の更新*
     * 
     * 主に物理演算
     */
    update() {
        const centerX = windowWidth / 2;
        const centerY = windowHeight / 2;

        this.openMap();
        //this.closeMap();

        // いつもの情報更新
        //vel.set(cos(dir.x),sin(dir.x)).mult(dir.y);
        this.vel.normalize(); // 方向のみを決めるために速度を正規化
        this.vel.mult(this.dir.y); // 速度を改めて決める
        if (this.vel.x <= 1e-3 && this.vel.y <= 1e-3) {
            //vel = createVector.random2D().mult(dir.y);
            //vel.set(cos(dir.x),sin(dir.x)).mult(dir.y);
        }

        // 途中で止まらないように
        // 画面の中心にひきつける
        //dirc = atan2(mouseY-pos.y, mouseX-pos.x);
        // let dirc = atan2(centerY - this.pos.y, centerX - this.pos.x);
        // this.vel.add(createVector(cos(dirc), sin(dirc)).mult(0.01));

        // 空間にぐるぐる回転するベクトル
        // 自身と中心を結ぶ線の自身と交わる法線の方向
        let agl = atan2(this.pos.y - centerY, this.pos.x - centerX);
        this.vel.add(createVector(-sin(agl), cos(agl)).mult(0.5));

        // 座標を更新
        //vel.add(acc);
        this.pos.add(this.vel);

        // mates[LIST]をクリア
        this.mates = []; 
    }

    /**
     * *描画*
     */
    show() {
        // noFill();
        fill(color("black"));
        //stroke(0);
        stroke(color("black"));
        ellipse(this.pos.x, this.pos.y, this.dm, this.dm);
        let p = 10 / 2;
        line(this.pos.x,
            this.pos.y,
            this.pos.x + p * this.vel.x,
            this.pos.y + p * this.vel.y);
    }

    /**
     * *探知できた他のオブジェクト情報を記憶*
     * 
     * @param {Boid} _m 
     */
    addMate(_m) {
        this.mates.push(_m);
    }

    /**
     * *座標間の距離の取得*
     * 
     * @param {*} _v 
     */
    getDist(_v) {
        return dist(this.pos.x, this.pos.y, _v.x, _v.y);
    }

    /**
     * *探知できる範囲の描画*
     */
    showSensorRange() {
        //noFill();
        fill(255, 0, 0, 10);
        stroke(255, 0, 0);
        ellipse(this.pos.x, this.pos.y, this.range * 2, this.range * 2);
    }

    /**
     * *探知できたmatesとの接続をラインで描画*
     */
    showSensorLine() {
        if (this.mates.length !== 0) {
            for (let i = 0; i < this.mates.length; i++) {
                stroke(255, 0, 0, 200);
                line(this.pos.x, this.pos.y, this.mates[i].pos.x, this.mates[i].pos.y);
            }
        }
    }

    /**
     * *MAIN*
     * 
     * *matesを探知し，メソッドを実行*
     * * cohese: 凝縮
     * * separate: 回避
     * * aligh: 一致
     * 
     * @param {Boid} _m 
     * 
     * 
     */
    sensor(_m) {
        let v = _m.pos;
        if (this.getDist(v) < this.range) {
            this.addMate(_m);

            this.cohese();
            this.separate(v);
            this.align();
        }
    }

    /**
     * *衝突回避*
     * 
     * @param {*} _v 
     */
    separate(_v) {
        //if(range > getDist(_v)) {
        //    dirc = -atan2(_v.y-pos.y, _v.x-pos.x);
        //    vel.add(cos(dirc),sin(dirc)).mult(1);
        //}
        let s = createVector(0, 0);
        //if(!mates.isEmpty()){
        for (let i = 0; i < this.mates.length; i++) {
            if (this.dm * 8 > this.getDist(this.mates[i].pos)) {
                s.add(this.mates[i].pos);
            }
        }
        s.add(this.pos);
        s.div(this.mates.length + 1);
        //}
        let dirc = atan2(s.y - this.pos.y, s.x - this.pos.x);
        this.vel.sub(s.set(cos(dirc), sin(dirc)).mult(this.dir.y).normalize()).mult(1);
        //dirc = -atan2(s.y-pos.y, s.x-pos.x);
        //vel.set(s.set(cos(dirc),sin(dirc)).mult(dir.y).normalize()).mult(1);
    }

    /**
     * *進路一致*
     * 
     */
    align() {
        //setDirc(atan2(_v.y-pos.y, _v.x-pos.x));
        let v = createVector(0, 0);
        if (this.mates.length !== 0) {
            for (let i = 0; i < this.mates.length; i++) {
                v.add(this.mates[i].vel);
            }
            v.normalize();
        }
        this.vel.add(v.mult(1));
    }

    /**
     * *凝縮*
     * 
     */
    cohese() {
        let s = createVector(0, 0);
        if (this.mates.length !== 0) {
            for (let i = 0; i < this.mates.length; i++) {
                s.add(this.mates[i].pos);
            }
            s.add(this.pos);
            s.div(this.mates.length + 1);
        }
        let dirc = atan2(s.y - this.pos.y, s.x - this.pos.x);
        this.vel.add(createVector(cos(dirc), sin(dirc)).mult(this.dir.y).normalize());
    }

    /**
     * *マップの設定 1*
     * 
     * **ドラクエマップ方式**:
     * 下から上， 左から右
     */
    openMap() {
        const width = windowWidth;
        const height = windowHeight;

        // about X position
        if (this.pos.x < -this.dm) {
            this.pos.x += width + this.dm;
        } else if (this.pos.x > width + this.dm) {
            this.pos.x -= width - this.dm;
        }
        // about Y position
        if (this.pos.y < -this.dm) {
            this.pos.y += height + this.dm;
        } else if (this.pos.y > height + this.dm) {
            this.pos.y -= height - this.dm;
        }
    }

    /**
     * *マップの設定 2*
     * 
     * **閉鎖方式**:
     * 画面から出ない
     */
    closeMap() {
        // about X position
        if (this.pos.x < this.dm / 2) {
            this.pos.x = this.dm / 2;
        } else if (this.pos.x > width - this.dm / 2) {
            this.pos.x = width - this.dm / 2;
        }
        // about Y position
        if (this.pos.y < this.dm / 2) {
            this.pos.y = this.dm / 2;
        } else if (this.pos.y > height - this.dm / 2) {
            this.pos.y = height - this.dm / 2;
        }
    }
}