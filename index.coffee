
module.exports = (game, opts) -> new BucketPlugin game, opts

class BucketPlugin
  constructor: (@game, @opts) ->
    @registry = @game.plugins.get('voxel-registry') ? throw new Error('voxel-bucket requires voxel-registry plugin')

    opts.fluids ?= ['water', 'milk', 'lava'] # TODO: fluid registry

    opts.registerBlocks ?= true
    opts.registerItems ?= true

    @enable()

  enable: () ->
    if @opts.registerItems
      @registry.registerItem 'bucket', {itemTexture: 'i/bucket_empty', onUse: @pickupFluid.bind(@)}

      ucfirst = (s) -> s.substr(0, 1).toUpperCase() + s.substring(1)

      for fluid in @opts.fluids
        @registry.registerItem "bucket#{ucfirst fluid}", {itemTexture: "i/bucket_#{fluid}", fluid: fluid, containerItem: 'bucket', onUse: @placeFluid.bind(@, fluid)}

    #if @opts.registerBlocks
    # TODO

  disable: () ->
    # TODO

  pickupFluid: (held, target) ->
    console.log 'pickupFluid',held,target

  placeFluid: (fluid, held, target)  ->
    console.log 'placeFluid',fluid,held,target

