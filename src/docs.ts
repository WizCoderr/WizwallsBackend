// Swagger configuration
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Wallpaper API Documentation',
    version: '1.0.0',
    description: 'API documentation for Wallpaper collection and management system',
    contact: {
      name: 'API Support'
    }
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Public',
      description: 'Public API endpoints for accessing wallpapers'
    },
    {
      name: 'Admin',
      description: 'Admin endpoints for managing collections (restricted on server)'
    },
    {
      name: 'System',
      description: 'System control endpoints'
    }
  ],
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Check if server is working',
        responses: {
          '200': {
            description: 'Server is working',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Server is working'
                }
              }
            }
          }
        }
      }
    },
    '/public/category': {
      get: {
        tags: ['Public'],
        summary: 'Get all categories',
        description: 'Retrieve all wallpaper collections/categories',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      title: { type: 'string' },
                      cover_photo: { type: 'string' },
                      blur_hash: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Server Internal Error'
          }
        }
      }
    },
    '/public/getAllWallpapers': {
      get: {
        tags: ['Public'],
        summary: 'Get all wallpapers',
        description: 'Retrieve all wallpapers with pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: true,
            description: 'Page number (must be >= 1)',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Wallpaper'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad Request'
          },
          '500': {
            description: 'Server Internal Error'
          }
        }
      }
    },
    '/public/wallpapers': {
      get: {
        tags: ['Public'],
        summary: 'Get wallpapers by collection',
        description: 'Retrieve wallpapers from a specific collection with pagination',
        parameters: [
          {
            name: 'id',
            in: 'query',
            required: true,
            description: 'Collection ID',
            schema: {
              type: 'string',
              example: 'collection123'
            }
          },
          {
            name: 'page',
            in: 'query',
            required: true,
            description: 'Page number (must be >= 1)',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Wallpaper'
                  }
                }
              }
            }
          },
          '400': {
            description: 'Bad Request'
          },
          '500': {
            description: 'Server Internal Error'
          }
        }
      }
    },
    '/public/wallpaper/{id}': {
      get: {
        tags: ['Public'],
        summary: 'Get wallpaper by ID',
        description: 'Retrieve a specific wallpaper by its ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Wallpaper ID',
            schema: {
              type: 'string',
              example: 'wallpaper123'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Wallpaper'
                }
              }
            }
          },
          '404': {
            description: 'Not Found'
          },
          '400': {
            description: 'Bad Request'
          }
        }
      }
    },
    '/public/wallpaper/search/{query}/{page}': {
      get: {
        tags: ['Public'],
        summary: 'Search wallpapers',
        description: 'Search wallpapers by query with pagination',
        parameters: [
          {
            name: 'query',
            in: 'path',
            required: true,
            description: 'Search term',
            schema: {
              type: 'string',
              example: 'nature'
            }
          },
          {
            name: 'page',
            in: 'path',
            required: true,
            description: 'Page number (must be >= 1)',
            schema: {
              type: 'integer',
              minimum: 1,
              example: 1
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Wallpaper'
                  }
                }
              }
            }
          },
          '404': {
            description: 'Not Found'
          },
          '400': {
            description: 'Bad Request'
          }
        }
      }
    },
    '/admin/collections/{name}': {
      get: {
        tags: ['Admin'],
        summary: 'Search collections on Unsplash',
        description: 'Search for collections by name on Unsplash',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            description: 'Collection name to search',
            schema: {
              type: 'string',
              example: 'nature'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response'
          },
          '403': {
            description: 'Forbidden - This request is restricted on server side'
          }
        }
      }
    },
    '/admin/collections/photos/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get photos from collection',
        description: 'Get photos from a specific Unsplash collection',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Collection ID',
            schema: {
              type: 'string',
              example: 'collection123'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response'
          },
          '403': {
            description: 'Forbidden - This request is restricted on server side'
          }
        }
      }
    },
    '/admin/latest': {
      get: {
        tags: ['Admin'],
        summary: 'Get latest collections',
        description: 'Get latest collections from Unsplash',
        responses: {
          '200': {
            description: 'Successful response'
          },
          '403': {
            description: 'Forbidden - This request is restricted on server side'
          }
        }
      }
    },
    '/admin/add/collections/{name}': {
      get: {
        tags: ['Admin'],
        summary: 'Add collections to queue',
        description: 'Add collections to processing queue',
        parameters: [
          {
            name: 'name',
            in: 'path',
            required: true,
            description: 'Collection name to add',
            schema: {
              type: 'string',
              example: 'nature'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Successfully added'
          },
          '403': {
            description: 'Forbidden - This request is restricted on server side'
          }
        }
      }
    },
    '/admin/photos': {
      get: {
        tags: ['Admin'],
        summary: 'Fetch next photos',
        description: 'Fetch the next batch of photos',
        responses: {
          '200': {
            description: 'Successful response'
          },
          '403': {
            description: 'Forbidden - This request is restricted on server side'
          }
        }
      }
    },
    '/start': {
      get: {
        tags: ['System'],
        summary: 'Start fetching process',
        description: 'Start the fetch and upload process for wallpapers',
        responses: {
          '200': {
            description: 'Process started or already running',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  enum: ['Started', 'Already started', 'Collection Over']
                }
              }
            }
          }
        }
      }
    },
    '/stop': {
      get: {
        tags: ['System'],
        summary: 'Stop fetching process',
        description: 'Stop the fetch and upload process',
        responses: {
          '200': {
            description: 'Process stopping',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Stopping'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Wallpaper: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Wallpaper ID'
          },
          category_id: {
            type: 'string',
            description: 'Category/Collection ID'
          },
          created_at: {
            type: 'integer',
            description: 'Creation timestamp'
          },
          width: {
            type: 'integer',
            description: 'Image width in pixels'
          },
          height: {
            type: 'integer',
            description: 'Image height in pixels'
          },
          color: {
            type: 'string',
            description: 'Dominant color'
          },
          blur_hash: {
            type: 'string',
            description: 'BlurHash string'
          },
          description: {
            type: 'string',
            description: 'Image description'
          },
          image_url: {
            type: 'string',
            description: 'Image URL'
          },
          likes: {
            type: 'integer',
            description: 'Number of likes'
          },
          is_premium: {
            type: 'boolean',
            description: 'Premium status'
          }
        }
      },
      Category: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Category ID'
          },
          title: {
            type: 'string',
            description: 'Category title'
          },
          cover_photo: {
            type: 'string',
            description: 'Cover photo URL'
          },
          blur_hash: {
            type: 'string',
            description: 'BlurHash for cover photo'
          }
        }
      }
    }
  }
};

