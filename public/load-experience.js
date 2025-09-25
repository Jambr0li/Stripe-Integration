;(function () {
  // Get the current script tag once and reuse it
  var currentScript = document.currentScript

  // Configuration - dynamically set based on environment
  var getEnvironmentConfig = function () {
    var scriptSrc = currentScript ? currentScript.src : window.location.href

    if (scriptSrc.includes('studio.anagram.ai')) {
      // Production environment
      return {
        baseUrl: 'https://studio.anagram.ai',
        allowedOrigins: ['https://studio.anagram.ai'],
      }
    } else if (scriptSrc.includes('staging.anagram.ai')) {
      // Staging/Preview environment
      return {
        baseUrl: 'https://staging.anagram.ai',
        allowedOrigins: ['https://staging.anagram.ai'],
      }
    } else {
      // Local development environment
      return {
        baseUrl: 'http://localhost:3000',
        allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
      }
    }
  }

  var envConfig = getEnvironmentConfig()
  var CONFIG = {
    baseUrl: envConfig.baseUrl,
    allowedOrigins: envConfig.allowedOrigins,
    defaultHeight: 0,
    bufferResetHeight: 0,
  }

  // Validate the current script tag
  if (!currentScript) {
    console.error('Widget: No <script> context found.')
    return
  }

  // Parse experienceID from the script URL
  var params = new URL(currentScript.src).searchParams
  var experienceID = params.get('experienceID')
  if (!experienceID) {
    console.error("Widget: Missing 'experienceID' in script src.")
    return
  }

  // === localStorage Management Functions ===
  var generateShopperId = function () {
    // Fallback for older browsers
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // Fallback implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0
      var v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  var generateSessionId = function (shopperId) {
    return shopperId + '==' + new Date().toISOString()
  }

  var parseAndValidateSessionId = function (shopperId, sessionId) {
    if (!sessionId) {
      return false
    }

    var parts = sessionId.split('==')
    var parsedShopperId = parts[0]
    var timestamp = parts[1]

    if (!parsedShopperId || !timestamp) {
      console.error('Error parsing Anagram session ID: Invalid session ID format')
      return false
    }

    var parsedDate = new Date(timestamp)
    if (Number.isNaN(parsedDate.getTime())) {
      console.error('Error parsing Anagram session ID: Invalid timestamp format')
      return false
    }

    if (parsedShopperId !== shopperId) {
      console.error('Error parsing Anagram session ID: Shopper ID mismatch')
      return false
    }

    var oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24)
    if (parsedDate < oneDayAgo) {
      return false
    }

    return true
  }

  // === Safe localStorage Utility Functions ===
  var safeGetFromLocalStorage = function (key) {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('Widget: Failed to get item from localStorage:', key, error)
      return null
    }
  }

  var safeSetToLocalStorage = function (key, value) {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      // Handle specific error types
      if (error.name === 'QuotaExceededError') {
        console.error('Widget: localStorage quota exceeded for key:', key)
      } else if (error.name === 'SecurityError') {
        console.error('Widget: Security error accessing localStorage for key:', key)
      } else {
        console.error('Widget: Failed to set item in localStorage:', key, error)
      }
      return false
    }
  }

  var setShopperAndSessionIds = function () {
    var shopperId = safeGetFromLocalStorage('AnagramShopperId')
    var sessionId = safeGetFromLocalStorage('AnagramSessionId')

    if (!shopperId) {
      shopperId = generateShopperId()
      safeSetToLocalStorage('AnagramShopperId', shopperId)
    }

    if (!parseAndValidateSessionId(shopperId, sessionId)) {
      sessionId = generateSessionId(shopperId)
      safeSetToLocalStorage('AnagramSessionId', sessionId)
    }
  }

  // === DOM Creation ===
  var container = document.createElement('div')
  container.style.position = 'relative'
  container.style.width = '100%'
  container.style.overflow = 'hidden'

  var iframeWrapper = document.createElement('div')
  iframeWrapper.style.width = '100%'
  iframeWrapper.style.transition = 'height 0.2s ease'
  iframeWrapper.style.height = CONFIG.defaultHeight + 'px'

  var iframe = document.createElement('iframe')
  iframe.src = CONFIG.baseUrl + '/live/experiences/' + experienceID
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.setAttribute('scrolling', 'no')
  iframe.setAttribute('loading', 'lazy') // Performance improvement

  iframeWrapper.appendChild(iframe)

  // === 4. Create buffer div ===
  var buffer = document.createElement('div')
  buffer.style.height = CONFIG.bufferResetHeight + 'px' // Initial buffer
  buffer.style.transition = 'height 0.2s ease'

  // === 5. Insert container into the DOM ===
  container.appendChild(iframeWrapper)
  container.appendChild(buffer)

  // Insert container just before the script tag
  if (currentScript.parentNode) {
    currentScript.parentNode.insertBefore(container, currentScript)
  }

  // === Message Handling ===
  window.addEventListener('message', function (event) {
    // SECURITY: Validate origin
    if (!CONFIG.allowedOrigins.includes(event.origin)) {
      return
    }

    try {
      var messageData = event.data || {}

      switch (messageData.type) {
        case 'ANAGRAM_RESIZE':
          var newHeight = Number(messageData.height)
          if (!isNaN(newHeight) && newHeight > 0) {
            var currentIframeHeight = parseInt(iframeWrapper.style.height) || CONFIG.defaultHeight
            var currentBufferHeight = parseInt(buffer.style.height) || CONFIG.bufferResetHeight

            // Only grow, never shrink
            if (newHeight > currentIframeHeight) {
              var growthNeeded = newHeight - currentIframeHeight

              if (growthNeeded <= currentBufferHeight) {
                // Use buffer space
                iframeWrapper.style.height = newHeight + 'px'
                buffer.style.height = currentBufferHeight - growthNeeded + 'px'
              } else {
                // Need more space than buffer provides
                iframeWrapper.style.height = newHeight + 'px'
                buffer.style.height = CONFIG.bufferResetHeight + 'px' // Fixed: now matches comment
              }
            }
          }
          break

        case 'ANAGRAM_ACTIVITY':
          if (
            messageData.key === 'AnagramLastUsedAt' &&
            typeof messageData.value === 'object' &&
            messageData.value.experienceId !== undefined &&
            messageData.value.lastUsedAt !== undefined
          ) {
            safeSetToLocalStorage(messageData.key, JSON.stringify(messageData.value))
            setShopperAndSessionIds()
          }
          break
      }
    } catch (error) {
      console.error('Widget: Error handling message:', error)
    }
  })
})()
