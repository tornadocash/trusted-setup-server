'use strict'
module.exports = (sequelize, DataTypes) => {
  const Contribution = sequelize.define(
    'Contribution',
    {
      token: DataTypes.STRING,
      name: DataTypes.STRING,
      company: DataTypes.STRING,
      handle: DataTypes.STRING,
      socialType: DataTypes.STRING,
      hash: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (contribution, options) => {
          const { name, company } = contribution.dataValues
          if (name.length < 4 || name.length > 35) {
            throw new Error('Wrong name')
          }
          if (company && company.length > 35) {
            throw new Error('Wrong company')
          }
        }
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
