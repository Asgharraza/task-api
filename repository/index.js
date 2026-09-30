const usePostgres = process.env.REPO === 'postgres';
module.exports = usePostgres
  ? require('./postgres')
  : require('./sqlite');