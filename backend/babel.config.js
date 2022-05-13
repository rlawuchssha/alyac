module.exports = (api) => {
  const setting = {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '^3.6.4',
          targets: { node: 'current' },
        },
      ],
    ],
    plugins: [
      [
        '@babel/plugin-proposal-class-properties',
        { loose: false },
      ],
      [
        'inline-dotenv',
        { path: 'config/.env.product' },
      ],
    ],
    ignore: ['node_modules'],
  }
  if (api.env('product') || api.env('staging')) {
  }
  return setting
}
