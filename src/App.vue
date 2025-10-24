<template>
  <div class="app">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <h1 class="text-center mb-3"><i class="fas fa-headphones-alt"></i> Podcast Player</h1>
          <p class="subtitle text-center">
            مشغل البودكاست الاحترافي - استمتع بتجربة استماع رائعة مع واجهة مشابهة لـ Spotify
          </p>

          <!-- Input Section - Collapsible on Mobile -->
          <div class="input-section-wrapper">
            <!-- Toggle Button for Mobile -->
            <button 
              class="btn btn-success w-100 d-md-none mb-3 input-toggle"
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#inputCollapse" 
              aria-expanded="true" 
              aria-controls="inputCollapse"
            >
              <i class="fas fa-plus-circle"></i> إضافة مقطع جديد
              <i class="fas fa-chevron-down float-start"></i>
            </button>

            <!-- Collapsible Input Section -->
            <div class="collapse show d-md-block" id="inputCollapse">
              <div class="input-section">
                <div class="row g-3 w-100">
                  <div class="col-12 col-md-7">
                    <div class="input-group">
                      <input 
                        v-model="inputUrl" 
                        @keyup.enter="addUrl"
                        placeholder="🔗 ألصق رابط YouTube هنا..."
                        class="form-control form-control-lg"
                      />
                      <button class="btn btn-outline-success" @click="pasteFromClipboard" type="button">
                        <i class="fas fa-paste"></i> لصق
                      </button>
                    </div>
                  </div>
                  <div class="col-12 col-md-5">
                    <div class="d-flex gap-2">
                      <button @click="addUrl" class="btn btn-success flex-grow-1">
                        <i class="fas fa-plus-circle"></i> إضافة للقائمة
                      </button>
                      <button class="btn btn-danger" @click="clearPlaylist" v-if="playlist.length">
                        <i class="fas fa-trash-alt"></i> مسح الكل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

    <!-- Player Box (shown when playing) -->
    <div class="player-box" v-if="currentId">
      <div class="player-info">
        <div class="player-title">{{ currentTitle || 'جاري التحميل...' }}</div>
        <div class="player-meta" v-if="currentIndex !== null">
          المقطع {{ currentIndex + 1 }} من {{ playlist.length }}
        </div>
        <div class="player-status" v-if="!isPlaying && currentTime > 0">
          <i class="fas fa-pause-circle"></i> متوقف مؤقتاً - اضغط تشغيل للمتابعة
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section">
        <div 
          class="progress-bar" 
          @mousedown="startDrag"
          @touchstart="startDrag"
          @mousemove="handleProgressHover"
          @mouseleave="clearProgressHover"
          ref="progressBar"
        >
          <div class="progress-fill" :style="{ width: progressPercent + '%' }">
            <div 
              class="progress-handle"
              v-show="duration > 0"
            ></div>
          </div>
          <div 
            class="progress-tooltip" 
            :style="{ right: hoverPercent + '%' }"
          >
            {{ formatTime(hoverTime) }}
          </div>
        </div>
        <div class="time-display">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="btn-group" role="group">
          <button @click="prev" :disabled="!hasPrev" class="btn btn-secondary">
            <i class="fas fa-step-backward"></i> السابق
          </button>
          <button @click="rewind10" class="btn btn-outline-light">
            <i class="fas fa-undo"></i> -10 ث
          </button>
          <button @click="togglePlay" class="btn btn-light btn-play">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
            {{ isPlaying ? ' إيقاف' : ' تشغيل' }}
          </button>
          <button @click="forward10" class="btn btn-outline-light">
            <i class="fas fa-redo"></i> +10 ث
          </button>
          <button @click="next" :disabled="!hasNext" class="btn btn-secondary">
            التالي <i class="fas fa-step-forward"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Playlist -->
    <div class="playlist" v-if="playlist.length">
      <h3><i class="fas fa-list-ul"></i> قائمة التشغيل ({{ playlist.length }})</h3>
      <div class="list-group list-group-flush">
        <div 
          v-for="(item, idx) in playlist" 
          :key="item.id + idx"
          :class="['list-group-item track', { active: currentIndex === idx }]"
          @click="playIndex(idx)"
        >
          <div class="d-flex w-100 justify-content-between align-items-center">
            <div class="track-info flex-grow-1">
              <div class="track-title">
                <i :class="currentIndex === idx ? 'fas fa-volume-up text-success' : 'fas fa-music'"></i>
                {{ item.title || 'جاري التحميل...' }}
              </div>
              <div class="track-url"><i class="fas fa-link"></i> {{ item.url }}</div>
            </div>
            <div class="track-actions">
              <button @click.stop="playIndex(idx)" :disabled="currentIndex === idx" class="btn btn-sm btn-outline-light me-2">
                <i :class="currentIndex === idx ? 'fas fa-spinner fa-spin' : 'fas fa-play'"></i>
                {{ currentIndex === idx ? ' يُشغّل' : ' تشغيل' }}
              </button>
              <button class="btn btn-sm btn-outline-danger" @click.stop="removeIndex(idx)">
                <i class="fas fa-trash"></i> حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div class="empty-state text-center" v-else>
      <i class="fas fa-music empty-icon"></i>
      <p class="fs-5 fw-bold">قائمة التشغيل فارغة</p>
      <p class="text-muted">ابدأ بإضافة مقاطع YouTube المفضلة لديك</p>
    </div>

    <!-- Hidden YouTube Player -->
    <div class="hidden-player">
      <div id="yt-player"></div>
    </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'

export default {
  name: 'App',
  setup() {
    // State
    const inputUrl = ref('')
    const playlist = ref(JSON.parse(localStorage.getItem('yt_playlist') || '[]'))
    const currentIndex = ref(null)
    const player = ref(null)
    const isPlaying = ref(false)
    const currentTitle = ref('')
    const currentId = ref(null)
    
    // Progress tracking
    const currentTime = ref(0)
    const duration = ref(0)
    const progressBar = ref(null)
    const progressInterval = ref(null)
    const isDragging = ref(false)
    const hoverTime = ref(0)
    const hoverPercent = ref(0)

    // Computed
    const progressPercent = computed(() => {
      if (!duration.value) return 0
      return (currentTime.value / duration.value) * 100
    })

    const hasPrev = computed(() => currentIndex.value > 0)
    const hasNext = computed(() => 
      currentIndex.value !== null && currentIndex.value < playlist.value.length - 1
    )

    // Helpers
    function extractVideoId(url) {
      if (!url) return null
      // Support youtu.be and youtube.com/watch?v=
      const patterns = [
        /(?:v=|\/)([\w-]{11})/,
        /youtu\.be\/([\w-]{11})/,
        /embed\/([\w-]{11})/
      ]
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
      }
      return null
    }

    function formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    function savePlaylist() {
      localStorage.setItem('yt_playlist', JSON.stringify(playlist.value))
    }

    function saveCurrentPosition() {
      if (currentIndex.value !== null && player.value) {
        const pos = {
          index: currentIndex.value,
          time: currentTime.value,
          wasPlaying: isPlaying.value
        }
        localStorage.setItem('yt_last_position', JSON.stringify(pos))
      }
    }

    function loadSavedPosition() {
      const saved = localStorage.getItem('yt_last_position')
      if (saved) {
        try {
          const pos = JSON.parse(saved)
          if (pos.index < playlist.value.length) {
            currentIndex.value = pos.index
            const item = playlist.value[pos.index]
            currentId.value = item.id
            currentTitle.value = item.title
            
            // تحميل الفيديو بدون تشغيل تلقائي
            if (player.value && player.value.cueVideoById) {
              player.value.cueVideoById({
                videoId: item.id,
                startSeconds: pos.time || 0
              })
              currentTime.value = pos.time || 0
              duration.value = 0
            }
            
            // تحديث العنوان
            setTimeout(updateCurrentTitle, 1000)
          }
        } catch (e) {
          console.error('Failed to load position:', e)
        }
      }
    }

    // Playlist Management
    function addUrl() {
      const id = extractVideoId(inputUrl.value.trim())
      if (!id) {
        alert('⚠️ الرابط غير صالح. تأكد من أنه رابط YouTube صحيح.')
        return
      }
      const url = inputUrl.value.trim()
      
      // Check duplicates
      if (playlist.value.some(item => item.id === id)) {
        alert('⚠️ هذا المقطع موجود بالفعل في القائمة')
        return
      }
      
      playlist.value.push({ id, url, title: null })
      inputUrl.value = ''
      savePlaylist()
      
      // تحميل أول مقطع بدون تشغيل تلقائي
      if (currentIndex.value === null && playlist.value.length === 1) {
        currentIndex.value = 0
        currentId.value = id
        if (player.value && player.value.cueVideoById) {
          player.value.cueVideoById({
            videoId: id,
            startSeconds: 0
          })
          setTimeout(updateCurrentTitle, 1000)
        }
      }

      // Auto-collapse on mobile after adding
      if (window.innerWidth < 768) {
        const collapseEl = document.getElementById('inputCollapse')
        if (collapseEl && window.bootstrap) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(collapseEl) || new window.bootstrap.Collapse(collapseEl, { toggle: false })
          bsCollapse.hide()
        }
      }
    }

    function clearPlaylist() {
      if (!confirm('هل تريد حذف قائمة التشغيل بالكامل؟')) return
      playlist.value = []
      savePlaylist()
      stop()
      currentIndex.value = null
      currentId.value = null
      currentTitle.value = ''
      localStorage.removeItem('yt_last_position')
    }

    function removeIndex(i) {
      playlist.value.splice(i, 1)
      if (currentIndex.value === i) {
        stop()
        currentIndex.value = null
        currentId.value = null
        currentTitle.value = ''
      } else if (currentIndex.value > i) {
        currentIndex.value--
      }
      savePlaylist()
    }

    function playIndex(i, startTime = 0, autoPlay = true) {
      if (i < 0 || i >= playlist.value.length) return
      currentIndex.value = i
      loadByIndex(i, startTime, autoPlay)
    }

    function loadByIndex(i, startTime = 0, autoPlay = true) {
      const item = playlist.value[i]
      if (!item) return
      
      currentId.value = item.id
      currentTime.value = startTime
      
      if (player.value && player.value.loadVideoById) {
        if (autoPlay) {
          // تشغيل مباشر
          player.value.loadVideoById({
            videoId: item.id,
            startSeconds: startTime
          })
          startProgressTracking()
        } else {
          // تحميل فقط بدون تشغيل
          player.value.cueVideoById({
            videoId: item.id,
            startSeconds: startTime
          })
        }
      }
      
      setTimeout(updateCurrentTitle, 1000)
      savePlaylist()
    }

    function updateCurrentTitle() {
      try {
        const data = player.value?.getVideoData?.()
        if (data?.title) {
          currentTitle.value = data.title
          if (playlist.value[currentIndex.value]) {
            playlist.value[currentIndex.value].title = data.title
            savePlaylist()
          }
          
          // MediaSession API
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: data.title,
              artist: 'YouTube',
              album: 'Podcast Player'
            })
          }
        }
      } catch (e) {
        console.error('Failed to update title:', e)
      }
    }

    // Playback Controls
    function prev() {
      if (hasPrev.value) playIndex(currentIndex.value - 1)
    }

    function next() {
      if (hasNext.value) playIndex(currentIndex.value + 1)
    }

    function togglePlay() {
      if (!player.value) return
      const state = player.value.getPlayerState()
      
      if (state === 1) { // Playing
        player.value.pauseVideo()
        isPlaying.value = false
        stopProgressTracking()
        saveCurrentPosition()
      } else if (state === 5 || state === 2 || state === -1) { // Cued, Paused, or Unstarted
        player.value.playVideo()
        isPlaying.value = true
        startProgressTracking()
      } else {
        player.value.playVideo()
        isPlaying.value = true
        startProgressTracking()
      }
    }

    function stop() {
      if (player.value?.stopVideo) {
        player.value.stopVideo()
      }
      isPlaying.value = false
      currentTime.value = 0
      stopProgressTracking()
    }

    function forward10() {
      if (!player.value || !duration.value) return
      const newTime = Math.min(currentTime.value + 10, duration.value)
      player.value.seekTo(newTime, true)
      currentTime.value = newTime
    }

    function rewind10() {
      if (!player.value) return
      const newTime = Math.max(currentTime.value - 10, 0)
      player.value.seekTo(newTime, true)
      currentTime.value = newTime
    }

    async function pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText()
        if (text) {
          inputUrl.value = text.trim()
        }
      } catch (err) {
        console.error('فشل اللصق من الحافظة:', err)
        alert('⚠️ يرجى السماح بالوصول إلى الحافظة أو استخدم Ctrl+V')
      }
    }



    function startDrag(event) {
      if (!duration.value) return
      isDragging.value = true
      
      // Prevent text selection
      event.preventDefault()
      
      let lastSeekTime = 0
      const handleMove = (e) => {
        if (!isDragging.value) return
        
        const rect = progressBar.value.getBoundingClientRect()
        // إصلاح للـ RTL - نحسب من اليمين
        const clientX = e.clientX || e.touches?.[0]?.clientX
        const moveX = rect.right - clientX
        const percent = Math.max(0, Math.min(1, moveX / rect.width))
        const seekTime = duration.value * percent
        
        // تحديث UI فوري
        currentTime.value = seekTime
        hoverTime.value = seekTime
        hoverPercent.value = percent * 100
        
        // تحديث YouTube player بشكل محدود لتجنب lag
        const now = Date.now()
        if (now - lastSeekTime > 100) { // كل 100ms فقط
          if (player.value && player.value.seekTo) {
            player.value.seekTo(seekTime, true)
          }
          lastSeekTime = now
        }
      }
      
      const handleEnd = (e) => {
        if (!isDragging.value) return
        
        // Seek نهائي دقيق عند الإفلات
        const rect = progressBar.value.getBoundingClientRect()
        const clientX = e.clientX || e.changedTouches?.[0]?.clientX
        const moveX = rect.right - clientX
        const percent = Math.max(0, Math.min(1, moveX / rect.width))
        const seekTime = duration.value * percent
        
        if (player.value && player.value.seekTo) {
          player.value.seekTo(seekTime, true)
        }
        currentTime.value = seekTime
        
        isDragging.value = false
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
      
      document.addEventListener('mousemove', handleMove, { passive: false })
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      
      // Immediate seek on start
      handleMove(event)
    }

    function handleProgressHover(event) {
      if (!duration.value || !progressBar.value) return
      
      const rect = progressBar.value.getBoundingClientRect()
      // إصلاح للـ RTL - نحسب من اليمين بدلاً من اليسار
      const hoverX = rect.right - event.clientX
      const percent = Math.max(0, Math.min(1, hoverX / rect.width))
      
      hoverPercent.value = percent * 100
      hoverTime.value = duration.value * percent
    }

    function clearProgressHover() {
      hoverTime.value = 0
      hoverPercent.value = 0
    }

    // Progress Tracking
    function startProgressTracking() {
      stopProgressTracking()
      
      // استخدام requestAnimationFrame لتحديث سلس مثل YouTube
      let lastTime = 0
      const updateProgress = (timestamp) => {
        if (!progressInterval.value) return
        
        // تحديث كل 50ms تقريباً
        if (timestamp - lastTime >= 50) {
          if (!isDragging.value && player.value?.getCurrentTime) {
            const newTime = player.value.getCurrentTime()
            // تحديث سلس بدون قفزات
            if (Math.abs(newTime - currentTime.value) > 0.1) {
              currentTime.value = newTime
            }
          }
          if (player.value?.getDuration) {
            duration.value = player.value.getDuration()
          }
          lastTime = timestamp
        }
        
        if (progressInterval.value) {
          requestAnimationFrame(updateProgress)
        }
      }
      
      progressInterval.value = true
      requestAnimationFrame(updateProgress)
      
      // حفظ كل 2 ثانية
      const saveTimer = setInterval(() => {
        if (isPlaying.value) saveCurrentPosition()
      }, 2000)
      
      progressInterval.saveTimer = saveTimer
    }

    function stopProgressTracking() {
      if (progressInterval.value) {
        if (progressInterval.saveTimer) {
          clearInterval(progressInterval.saveTimer)
        }
        progressInterval.value = null
      }
    }

    // YouTube IFrame API Integration
    window.onYouTubeIframeAPIReady = function() {
      player.value = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          controls: 0,
          disablekb: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: () => {
            console.log('YouTube Player Ready')
            loadSavedPosition()
          },
          onStateChange: (e) => {
            // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
            if (e.data === 1) { // Playing
              isPlaying.value = true
              updateCurrentTitle()
              startProgressTracking()
              duration.value = player.value.getDuration()
            } else if (e.data === 2) { // Paused
              isPlaying.value = false
              stopProgressTracking()
              saveCurrentPosition()
            } else if (e.data === 0) { // Ended
              isPlaying.value = false
              stopProgressTracking()
              if (hasNext.value) {
                next()
              } else {
                currentTime.value = 0
              }
            }
          },
          onError: (e) => {
            console.error('YouTube Player Error:', e.data)
            alert('⚠️ حدث خطأ في تشغيل الفيديو. قد يكون الفيديو محظوراً أو محذوفاً.')
          }
        }
      })
    }

    // MediaSession Setup
    onMounted(() => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => {
          player.value?.playVideo()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
          player.value?.pauseVideo()
        })
        navigator.mediaSession.setActionHandler('previoustrack', prev)
        navigator.mediaSession.setActionHandler('nexttrack', next)
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime && player.value) {
            player.value.seekTo(details.seekTime, true)
            currentTime.value = details.seekTime
          }
        })
      }

      // Auto-load if API already ready
      if (window.YT && window.YT.Player && !player.value) {
        window.onYouTubeIframeAPIReady()
      }

      // Auto-collapse input section after adding URL on mobile
      const collapseEl = document.getElementById('inputCollapse')
      if (collapseEl && window.innerWidth < 768) {
        collapseEl.addEventListener('shown.bs.collapse', () => {
          // Auto scroll to input on mobile
          setTimeout(() => {
            collapseEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        })
      }
    })

    // Cleanup
    onUnmounted(() => {
      stopProgressTracking()
      saveCurrentPosition()
    })

    // Watch playlist changes
    watch(playlist, savePlaylist, { deep: true })

    // Save position periodically
    watch([currentTime, currentIndex], () => {
      if (isPlaying.value) {
        saveCurrentPosition()
      }
    })

    return {
      inputUrl,
      playlist,
      currentIndex,
      currentTitle,
      currentId,
      isPlaying,
      currentTime,
      duration,
      progressPercent,
      progressBar,
      hasPrev,
      hasNext,
      hoverTime,
      hoverPercent,
      addUrl,
      clearPlaylist,
      removeIndex,
      playIndex,
      prev,
      next,
      togglePlay,
      stop,
      forward10,
      rewind10,
      pasteFromClipboard,
      startDrag,
      handleProgressHover,
      clearProgressHover,
      formatTime
    }
  }
}
</script>
