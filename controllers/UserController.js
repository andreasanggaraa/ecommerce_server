const { User } = require('../models/index.js');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UserController {

  static login(req, res, next) {
    const { email, password } = req.body;

    User.findOne({
      where: { email }
    })
      .then(response => {
        if (response) {
          if (comparePassword(password, response.password)) {
            const payload = {
              id: response.id,
              email: response.id,
              fulllname: response.fullname,
              isAdmin: response.isAdmin
            }

            const token = generateToken(payload)
            res.status(200).json({ token, fulllname: response.fullname })
          }
          else {
            next({
              status: 400,
              msg: "Invalid Email / Password"
            })
          }
        }
        else {
          next({
            status: 400,
            msg: "Invalid Email / Password "
          })
        }
      })
    .catch(err => {
      next(err)
    })
  }

  static register(req, res, nexxt) {
    const { email, password, fullname } = req.body

    User.create({ email, password, fullname })
      .then(response => {
        const payload = {
          id: response.id,
          email: response.email,
          fullname: response.fullname,
          isAdmin: response.isAdmin
        }

        const token = generateToken(payload);
        res.status(201).json({ token, fullname: response.fullname })
      })
        .catch(err => {
          next(err)
        })
  }
}

module.exports = UserController