'use strict'

function isValidName(value, minLength = 4) {
  const regExpression = new RegExp(`^[0-9a-zA-Z\\x20]{${minLength},35}$`)
  return regExpression.test(value)
}

const validate = (contribution, options) => {
  const { name, company, socialType } = contribution.dataValues
  if (socialType !== 'anonymous' && !isValidName(name)) {
    throw new Error('Wrong name')
  }
  if (company && !isValidName(company, 0)) {
    throw new Error('Wrong company')
  }
}

module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define(
    'Contribution',
    {
      token: DataTypes.STRING,
      name: DataTypes.STRING,
      company: DataTypes.STRING,
      handle: DataTypes.STRING,
      socialType: DataTypes.STRING,
      hash: DataTypes.STRING,
      attestation: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: validate,
        beforeUpdate: validate
      }
    }
  )
  Contribution.nextContributionIndex = async function() {
    const rowsCount = await this.count()
    return rowsCount + 1
  }

  Contribution.associate = function(models) {
    // associations can be defined here
  }
  return Contribution
}
