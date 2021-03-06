import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import User from './User';
import dotenv from 'dotenv';
import { UserTypes, DatabaseUserTypes } from './interface/UserTypes';

const LocalStrategy = passportLocal.Strategy;

dotenv.config();

mongoose.connect(
  //六時間、一日、一週間という機関でサーバーとの接続が切れるのでmongodb(network access でIP address再生性する必要がある)
  `${process.env.PART1STRING}${process.env.USERNAME}:${process.env.PASSWORD}${process.env.PART2STRING}`,
  {
    useCreateIndex: true, //mongooseのデフフォルトインデックスの構築に活用する機能
    useNewUrlParser: true, //ユーザーが新しいパーサーにバグを見つけたとき古いパーサーに逆戻りする機能
    useUnifiedTopology: true, //新しいトポロジエンジンに関連しなくなったいくつかの接続オプションのサポートが削除される機能
  },
  (err: Error) => {
    if (err) throw err;
    console.log('connect');
  }
);

//Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne(
      { username: username },
      (err: Error, user: DatabaseUserTypes) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result: boolean) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    );
  })
);

passport.serializeUser((user: DatabaseUserTypes, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: DatabaseUserTypes) => {
    const userInformation: UserTypes = {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

//Routes
app.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    res.send('Improper Values');
    return;
  }
  User.findOne({ username }, async (err: Error, doc: DatabaseUserTypes) => {
    if (err) throw err;
    if (doc) res.send('User Already Exist');
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send('success');
    }
  });
});

const isAdministratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;
  if (user) {
    User.findOne(
      { username: user.username },
      (err: Error, doc: DatabaseUserTypes) => {
        if (err) throw err;
        if (doc?.isAdmin) {
          //管理者側で見れるリンクを識別化するのをバックエンド側で実装
          next();
        } else {
          res.send("Sorry, only admin's can perform this.");
        }
      }
    );
  } else {
    res.send("Sorry, you aren't logged in.");
  }
};

//ローカル認証
app.post(
  '/login',
  passport.authenticate('local'),
  (req: Request, res: Response) => {
    res.send('success');
  }
);

app.get('/user', (req: Request, res: Response) => {
  res.send(req.user);
});

//passportによるログアウトの機能
app.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.send('success'); //client側のNavBar.tsxのlogout関数内res.dataに格納される値。
});

app.post('/deleteuser', isAdministratorMiddleware, async (req, res) => {
  const { id } = req?.body;
  await User.findByIdAndDelete(id);
  res.send('success');
});

app.get('/getallusers', isAdministratorMiddleware, async (_, res) => {
  await User.find({}, (err: Error, data: DatabaseUserTypes[]) => {
    if (err) throw err;
    const filteredUsers: UserTypes[] = [];
    data.forEach(({ _id, isAdmin, password, username }) => {
      const userInformation = {
        id: _id,
        username,
        isAdmin,
        password,
      };
      filteredUsers.push(userInformation);
    });

    res.send(filteredUsers);
  });
});

//アプリの起動
app.listen(4000, () => {
  console.log('server started');
});
