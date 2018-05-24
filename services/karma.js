const debug = require('debug')('talk:services:karma');
const UserModel = require('../models/user');
const { TRUST_THRESHOLDS } = require('../config');
const { get } = require('lodash');

/**
 * This will create an object with the property name of the action type as the
 * key and an object as it's value. This will contain a RELIABLE, and UNRELIABLE
 * property with the number of karma points associated with their particular
 * state.
 *
 * If only the RELIABLE variable is provided, then it will also be used as the
 * UNRELIABLE variable.
 *
 * The form of the environment variable is:
 *
 *  <name>:<RELIABLE>,<UNRELIABLE>;<name>:<RELIABLE>,<UNRELIABLE>;...
 *
 * The default used is:
 *
 *  comment:2,-2;flag:2,-2
 */
const parseThresholds = thresholds =>
  thresholds
    .split(';')
    .filter(threshold => threshold && threshold.length > 0)
    .reduce(
      (acc, threshold) => {
        const thresholds = threshold.split(':');
        if (thresholds.length < 2) {
          return acc;
        }

        let [name, values] = thresholds;
        let [RELIABLE, UNRELIABLE] = values
          .split(',')
          .map(value => parseInt(value));

        if (!(name in acc)) {
          acc[name] = {};
        }

        if (isNaN(UNRELIABLE) && !isNaN(RELIABLE)) {
          acc[name].RELIABLE = RELIABLE;
          acc[name].UNRELIABLE = RELIABLE;
        } else {
          if (!isNaN(UNRELIABLE)) {
            acc[name].UNRELIABLE = UNRELIABLE;
          }

          if (!isNaN(RELIABLE)) {
            acc[name].RELIABLE = RELIABLE;
          }
        }

        return acc;
      },
      {
        comment: {
          RELIABLE: 0,
          UNRELIABLE: 0,
        },
        flag: {
          RELIABLE: 0,
          UNRELIABLE: 0,
        },
      }
    );

const THRESHOLDS = parseThresholds(TRUST_THRESHOLDS);

debug('using thresholds: ', THRESHOLDS);

/**
 * KarmaModel represents the checkable properties of a user and wrapps the
 * KarmaService function `isReliable` to work flexibly with the graph.
 */
class KarmaModel {
  constructor(model) {
    this.model = model;
  }

  get flagger() {
    return KarmaService.isReliable('flag', this.model);
  }

  get flaggerKarma() {
    return get(this.model, 'flag.karma', 0);
  }

  get commenter() {
    return KarmaService.isReliable('comment', this.model);
  }

  get commenterKarma() {
    return get(this.model, 'comment.karma', 0);
  }
}

/**
 * KarmaService provides interfaces for editing a user's karma.
 */
class KarmaService {
  /**
   * Model returns a KarmaModel based on the passed in user.
   */
  static model(user) {
    if (user === null || !user.metadata || !user.metadata.trust) {
      return new KarmaModel({});
    }

    return new KarmaModel(user.metadata.trust);
  }

  /**
   * Inspects the reliability of a property and returns it if known.
   * @param {String} name - name of the property
   * @param {Object} trust - object possibly containing the properties
   */
  static isReliable(name, trust) {
    const karma = get(trust, [name, 'karma'], 0);

    if (karma >= THRESHOLDS[name].RELIABLE) {
      return true;
    } else if (karma <= THRESHOLDS[name].UNRELIABLE) {
      return false;
    }

    return null;
  }

  /**
   * modifyUserKarma updates the user to adjust their karma, for either the `type`
   * of 'comment' or 'flag'. If `multi` is true, then it assumes that `id` is an
   * array of id's.
   */
  static async modifyUser(id, direction = 1, type = 'comment', multi = false) {
    const key = `metadata.trust.${type}.karma`;

    let update = {
      $inc: {
        [key]: direction,
      },
    };

    if (multi) {
      // If it was in multi-mode but there was no user's to adjust, bail.
      if (id.length <= 0) {
        return;
      }

      return UserModel.update(
        {
          id: {
            $in: id,
          },
        },
        update,
        {
          multi: true,
        }
      );
    }

    return UserModel.update({ id }, update);
  }
}

module.exports = KarmaService;
module.exports.THRESHOLDS = THRESHOLDS;
