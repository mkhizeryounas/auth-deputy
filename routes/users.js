const express = require('express');
const router = express.Router();
const { User, Realm } = require('../config/models');
const common = require('../src/modules/common');
const locker = require('../src/modules/locker');

router.post('/signin', async function(req, res, next) {
  try {
    let _user = await User.findOne({ email: req.body.email }).populate({
      path: 'permission_group',
      populate: {
        path: 'scopes',
        model: 'Scope'
      }
    });
    if (!_user) throw { status: 401 };
    let authUser = await _user.checkPassword(req.body.password);
    if (!authUser) throw { status: 401 };
    authUser = authUser.toJSON();
    authUser['scopes'] = authUser.permission_group
      ? authUser.permission_group.scopes.map(e => e.name).join(',')
      : '';
    delete authUser['permission_group'];
    delete authUser['createdAt'];
    delete authUser['updatedAt'];
    delete authUser['source'];
    delete authUser['__v'];
    delete authUser['permission_group'];
    if (authUser.is_superuser) {
      authUser.scopes = authUser.scopes.split(',').filter(e => e !== '');
      authUser.scopes.push('authdeputy:admin');
      authUser.scopes = authUser.scopes.join(',');
    }
    let flagMode =
      req.query.access_mode && req.query.access_mode === 'offline_access'
        ? true
        : false;
    let accessToken = await locker.lock(authUser, flagMode);
    res.reply({ data: accessToken });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    let has_superuser = await User.findOne({ is_superuser: true });
    if (!has_superuser) {
      req.body.is_superuser = true;
      let keyPair = await common.generateKeyPair();
      let realmCheck = await Realm.findOne();
      if (!realmCheck) {
        let realm = new Realm({
          public_key: keyPair.public,
          private_key: keyPair.private
        });
        realm = await realm.save();
      }
    }
    let realmConfig = await Realm.findOne().then(e => e.toJSON());
    if (realmConfig.default_permission_group) {
      req.body.permission_group = realmConfig.default_permission_group;
    }
    let entry = new User(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log('Err', err);
    next(err);
  }
});

router.get('/', locker.unlock('authdeputy:admin'), async (req, res, next) => {
  try {
    let entries = await User.find().populate('permission_group');
    res.reply({ data: entries });
  } catch (err) {
    console.log('Err', err);
    next(err);
  }
});

router.get(
  '/:id',
  locker.unlock('authdeputy:admin'),
  async (req, res, next) => {
    try {
      let entry = await User.findOne({ _id: req.params.id }).populate(
        'permission_group'
      );
      if (!entry) throw { status: 404 };
      res.reply({ data: entry });
    } catch (err) {
      console.log('Err', err);
      next(err);
    }
  }
);

router.post('/', locker.unlock('authdeputy:admin'), async (req, res, next) => {
  try {
    if (!req.user.is_superuser) req.body.is_superuser = false;
    let entry = new User(req.body);
    entry = await entry.save();
    res.reply({ data: entry });
  } catch (err) {
    console.log('Err', err);
    next(err);
  }
});

router.put(
  '/:id',
  locker.unlock('authdeputy:admin'),
  async (req, res, next) => {
    try {
      if (!req.user.is_superuser) req.body.is_superuser = false;
      let entry = await User.findOne({ _id: req.params.id });
      if (!entry) throw { status: 404 };
      entry.name = req.body.name;
      entry.email = req.body.email;
      if (req.body.password) entry.password = req.body.password;
      entry.permission_group =
        req.body.permission_group === '' ? null : req.body.permission_group;
      entry.is_superuser = req.body.is_superuser;
      entry.external_reference = req.body.external_reference;
      entry = await entry.save();
      res.reply({ data: entry });
    } catch (err) {
      console.log('Err', err);
      next(err);
    }
  }
);

router.delete(
  '/:id',
  locker.unlock('authdeputy:admin'),
  async (req, res, next) => {
    try {
      if (!req.user.is_superuser) throw { statusCode: 403 };
      let entry = await User.findOne({ _id: req.params.id });
      if (!entry) throw { status: 404 };
      entry = await entry.remove();
      res.reply({ data: entry });
    } catch (err) {
      console.log('Err', err);
      next(err);
    }
  }
);

module.exports = router;
