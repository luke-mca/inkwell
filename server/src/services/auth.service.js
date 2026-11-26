// server/src/services/auth.service.js
//
// Implements Section 5.2's processing narratives exactly, in order.

import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { TokenService } from "./token.service.js";
import { logger } from "../lib/logger.js";
import { toPublicUser } from "../dto/user.dto.js";

class EmailAlreadyRegisteredError extends Error {}
class WeakPasswordError extends Error {}
class InvalidCredentialsError extends Error {}

const BCRYPT_COST_FACTOR = 10; // see Lecture 15 for the security tradeoff this number encodes
const MIN_PASSWORD_LENGTH = 8;

export const AuthService = {
  async register({ email, displayName, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(displayName, "displayName", "MISSING_DISPLAY_NAME");
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError();
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);

    let user;
    try {
      user = await UserRepository.create({ email, displayName, passwordHash });
    } catch (err) {
      // Defense in depth (Lecture 4, Section 6.2): the DB's @unique
      // constraint may reject a race-condition duplicate that slipped
      // past the check above (Section 4.4's concurrency note).
      throw new EmailAlreadyRegisteredError();
    }

    const tokens = TokenService.issueTokens(user);
    // Lecture 22: return only the public fields (Lecture 16's DTO), never
    // the database row, which includes passwordHash and email.
    return { user: toPublicUser(user), ...tokens };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // fix: a structured, leveled, machine-parseable log
      // line — searchable by "event" or "email" once aggregated
      // , not just a free-form sentence buried in scrollback.
      logger.warn(
        { event: "auth.login.failed", email },
        "Failed login attempt",
      );
      throw new InvalidCredentialsError();
    }

    const tokens = TokenService.issueTokens(user);
    return { user: toPublicUser(user), ...tokens };
  },
};

export {
  EmailAlreadyRegisteredError,
  WeakPasswordError,
  InvalidCredentialsError,
  ValidationError,
};
