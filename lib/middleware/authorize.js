module.exports = async (req, res, next) => {
  try {
    if (!req.body || !req.body.email.endsWith('@defense.gov'))
      throw new Error('email must end in @defense.gov to sign up');
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
