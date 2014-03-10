// Generated by CoffeeScript 1.7.0
(function() {
  var BucketPlugin, ItemPile, ucfirst;

  ItemPile = require('itempile');

  ucfirst = require('ucfirst');

  module.exports = function(game, opts) {
    return new BucketPlugin(game, opts);
  };

  module.exports.pluginInfo = {
    loadAfter: ['voxel-registry', 'voxel-fluid']
  };

  BucketPlugin = (function() {
    function BucketPlugin(game, opts) {
      var _ref, _ref1;
      this.game = game;
      this.opts = opts;
      this.registry = (function() {
        if ((_ref = this.game.plugins.get('voxel-registry')) != null) {
          return _ref;
        } else {
          throw new Error('voxel-bucket requires "voxel-registry" plugin');
        }
      }).call(this);
      this.fluidPlugin = (function() {
        if ((_ref1 = this.game.plugins.get('voxel-fluid')) != null) {
          return _ref1;
        } else {
          throw new Error('voxel-bucket requires "voxel-fluid" plugin');
        }
      }).call(this);
      this.fluidBuckets = {};
      if (opts.registerBlocks == null) {
        opts.registerBlocks = true;
      }
      if (opts.registerItems == null) {
        opts.registerItems = true;
      }
      if (opts.registerRecipes == null) {
        opts.registerRecipes = true;
      }
      this.enable();
    }

    BucketPlugin.prototype.enable = function() {
      var bucketName, fluid, _i, _len, _ref, _ref1;
      if (this.opts.registerItems) {
        this.registry.registerItem('bucket', {
          itemTexture: 'i/bucket_empty',
          onUse: this.pickupFluid.bind(this),
          displayName: 'Empty Bucket'
        });
        _ref = this.fluidPlugin.getFluidNames();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          fluid = _ref[_i];
          bucketName = "bucket" + (ucfirst(fluid));
          this.registry.registerItem(bucketName, {
            itemTexture: "i/bucket_" + fluid,
            fluid: fluid,
            containerItem: 'bucket',
            onUse: this.placeFluid.bind(this, fluid),
            displayName: "" + (ucfirst(fluid)) + " Bucket"
          });
          this.fluidBuckets[fluid] = bucketName;
        }
      }
      if (this.opts.registerRecipes) {
        this.recipes = (function() {
          if ((_ref1 = this.game.plugins.get('voxel-recipes')) != null) {
            return _ref1;
          } else {
            throw new Error('voxel-bucket requires voxel-recipes plugin when opts.registerRecipes enabled');
          }
        }).call(this);
        return this.recipes.registerPositional([['ingotIron', void 0, 'ingotIron'], ['ingotIron', 'ingotIron', 'ingotIron'], [void 0, void 0, void 0]], new ItemPile('bucket'));
      }
    };

    BucketPlugin.prototype.disable = function() {};

    BucketPlugin.prototype.pickupFluid = function(held, target) {
      var flowing, fluid, fluidBucket, name, props;
      console.log('pickupFluid', held, target);
      if (!target) {
        return;
      }
      name = this.registry.getBlockName(target.value);
      props = this.registry.getBlockProps(name);
      if (props == null) {
        return;
      }
      fluid = props.fluid;
      if (!fluid) {
        return;
      }
      flowing = props.flowing;
      if (flowing) {
        return;
      }
      fluidBucket = this.fluidBuckets[fluid];
      if (!fluidBucket) {
        return;
      }
      this.game.setBlock(target.voxel, 0);
      return new ItemPile(fluidBucket);
    };

    BucketPlugin.prototype.placeFluid = function(fluid, held, target) {
      var fluidIndex;
      console.log('placeFluid', fluid, held, target);
      if (!target) {
        return;
      }
      fluidIndex = this.registry.getBlockID(fluid);
      if (fluidIndex == null) {
        return;
      }
      this.game.setBlock(target.adjacent, fluidIndex);
      return new ItemPile('bucket');
    };

    return BucketPlugin;

  })();

}).call(this);
