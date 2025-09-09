import { NextResponse } from 'next/server';

export async function GET() {
  const documentation = {
    title: "Revolutionary Video Platform API - IPFS Integration",
    description: "Decentralized video storage using IPFS with Nepalese revolutionary-themed usernames",
    version: "1.0.0",
    ipfsService: "https://ipfs.nepalz.xyz",
    
    authentication: {
      type: "Bearer Token (JWT)",
      header: "Authorization: Bearer <token>",
      note: "Required for all operations except viewing videos, registration, and login"
    },
    
    endpoints: {
      
      // Authentication
      auth: {
        register: {
          method: "POST",
          url: "/api/users",
          description: "Register with revolutionary username generation",
          auth: false,
          body: {
            password: "string (min 6 chars)"
          },
          response: {
            token: "JWT token",
            user: {
              user_id: "number",
              username: "string (e.g., 'Brave_Lakhan_Thapa_247')",
              createdAt: "datetime"
            }
          }
        },
        
        login: {
          method: "POST",
          url: "/api/auth/login",
          description: "Login with username and password",
          auth: false,
          body: {
            username: "string",
            password: "string"
          },
          response: {
            token: "JWT token",
            user: "user object"
          }
        }
      },
      
      // Video Operations
      videos: {
        
        uploadVideo: {
          method: "POST",
          url: "/api/videos/upload",
          description: "Upload video file to IPFS and create database record",
          auth: true,
          contentType: "multipart/form-data",
          body: {
            video: "File object (max 100MB, video/* types only)",
            caption: "string (optional)",
            tags: "string[] or comma-separated string (optional)"
          },
          response: {
            message: "Upload success message",
            video: {
              id: "database ID",
              hash: "IPFS hash",
              caption: "string",
              tags: "string[]",
              user: "user info",
              ipfs: {
                hash: "IPFS hash",
                size: "file size in bytes",
                originalName: "original filename",
                mimetype: "video mime type",
                accessUrls: {
                  primary: "https://ipfs.nepalz.xyz/api/ipfs/{hash}",
                  ipfsIo: "https://ipfs.io/ipfs/{hash}",
                  cloudflare: "https://cloudflare-ipfs.com/ipfs/{hash}",
                  dweb: "https://dweb.link/ipfs/{hash}",
                  torNetwork: "Tor onion URL"
                }
              }
            }
          }
        },
        
        createFromHash: {
          method: "POST",
          url: "/api/videos",
          description: "Create video record from existing IPFS hash",
          auth: true,
          body: {
            hash: "string (IPFS hash starting with 'Qm' or 'bafyb')",
            caption: "string (optional)",
            tags: "string[] (optional)"
          },
          response: "Video object with IPFS URLs"
        },
        
        listVideos: {
          method: "GET",
          url: "/api/videos",
          description: "Get all videos with IPFS access URLs",
          auth: false,
          response: "Array of video objects with IPFS info"
        },
        
        getVideo: {
          method: "GET",
          url: "/api/videos/{id}",
          description: "Get specific video with all details",
          auth: false,
          response: "Detailed video object with comments, likes, etc."
        },
        
        deleteVideo: {
          method: "DELETE",
          url: "/api/videos/{id}",
          description: "Delete video from database (IPFS file remains)",
          auth: true,
          note: "Only video owner can delete"
        },
        
        streamVideo: {
          method: "GET",
          url: "/api/videos/stream/{hash}",
          description: "Stream video directly from IPFS",
          auth: false,
          response: "Redirects to IPFS gateway for video streaming"
        },
        
        getMetadata: {
          method: "GET",
          url: "/api/videos/metadata/{hash}",
          description: "Get comprehensive video metadata from database and IPFS",
          auth: false,
          response: {
            hash: "IPFS hash",
            database: "Our database info (if exists)",
            ipfs: "IPFS service metadata",
            accessUrls: "All access methods",
            available: {
              inDatabase: "boolean",
              onIPFS: "boolean"
            }
          }
        }
      },
      
      // Social Features
      social: {
        
        comments: {
          list: {
            method: "GET",
            url: "/api/comments?video_id={id}",
            auth: false
          },
          create: {
            method: "POST",
            url: "/api/comments",
            auth: true,
            body: {
              video_id: "number",
              content: "string"
            }
          }
        },
        
        likes: {
          create: {
            method: "POST",
            url: "/api/likes",
            auth: true,
            body: { video_id: "number" }
          },
          remove: {
            method: "DELETE",
            url: "/api/likes?video_id={id}",
            auth: true
          }
        },
        
        dislikes: {
          create: {
            method: "POST",
            url: "/api/dislikes",
            auth: true,
            body: { video_id: "number" }
          },
          remove: {
            method: "DELETE",
            url: "/api/dislikes?video_id={id}",
            auth: true
          }
        },
        
        reports: {
          create: {
            method: "POST",
            url: "/api/reports",
            auth: true,
            body: {
              video_id: "number",
              reason: "string"
            }
          }
        }
      },
      
      // IPFS Service
      ipfs: {
        
        status: {
          method: "GET",
          url: "/api/ipfs/status",
          description: "Check IPFS service health and stats",
          auth: false
        },
        
        verify: {
          method: "GET",
          url: "/api/ipfs/verify/{hash}",
          description: "Verify IPFS hash accessibility and get info",
          auth: false
        }
      }
    },
    
    ipfsIntegration: {
      service: "https://ipfs.nepalz.xyz",
      features: [
        "Decentralized storage",
        "Global accessibility", 
        "Permanent hosting",
        "Anonymous upload via Tor",
        "Multi-gateway access",
        "Real-time analytics"
      ],
      
      accessMethods: {
        primary: "https://ipfs.nepalz.xyz/api/ipfs/{hash}",
        globalIPFS: "https://ipfs.io/ipfs/{hash}",
        cloudflare: "https://cloudflare-ipfs.com/ipfs/{hash}",
        dweb: "https://dweb.link/ipfs/{hash}",
        torNetwork: "http://6hfckp4suncoyum2dhvspm36m7bx2ga5gb4atlprw56sqdxa5qgw2zyd.onion/api/ipfs/{hash}"
      },
      
      limits: {
        maxFileSize: "100MB",
        supportedTypes: ["video/mp4", "video/avi", "video/mov", "video/webm", "video/mkv"],
        rateLimiting: "None",
        authentication: "Not required for IPFS service"
      }
    },
    
    revolutionaryFeatures: {
      usernameGeneration: {
        theme: "Nepalese revolutionaries and freedom fighters",
        examples: [
          "Brave_Lakhan_Thapa_247",
          "Revolutionary_Gangalal_Shrestha_589",
          "Fearless_Dharma_Bhakta_123",
          "Thunder_Prachanda_Warrior_442"
        ],
        automatic: true,
        unique: true
      }
    },
    
    examples: {
      videoUpload: {
        curl: `curl -X POST "https://your-domain.com/api/videos/upload" \\
  -H "Authorization: Bearer your_jwt_token" \\
  -F "video=@/path/to/video.mp4" \\
  -F "caption=Revolutionary video content" \\
  -F "tags=freedom,nepal,revolution"`
      },
      
      videoAccess: {
        directStream: "https://ipfs.nepalz.xyz/api/ipfs/QmYourVideoHashHere",
        metadata: "GET /api/videos/metadata/QmYourVideoHashHere",
        socialActions: "POST /api/likes with {video_id: 1}"
      }
    }
  };
  
  return NextResponse.json(documentation);
}
