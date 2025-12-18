<script>
  import { onMount, onDestroy } from 'svelte';

  // --- VARIABLES ---
  let activeTab = 'youtube'; // 'youtube' or 'image'
  
  // YouTube Variables
  let url = '';
  let videoId = null;
  let thumbnailUrl = null;
  let downloadType = 'audio'; // 'audio' or 'video'

  // Image Variables
  let imageUrl = '';
  let imageFormat = 'jpg';

  let selectedFolder = 'downloads'; 
  let isConverting = false; 
  let imageLoading = false; 
  let progress = 0; 
  let pollInterval = null; 
  let message = null;
  let history = [];

  const BACKEND_URL = `http://${window.location.hostname}:3001`;

  const icons = {
    youtube: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.49614 7.13176C9.18664 6.9549 8.80639 6.95617 8.49807 7.13509C8.18976 7.31401 8 7.64353 8 8V16C8 16.3565 8.18976 16.686 8.49807 16.8649C8.80639 17.0438 9.18664 17.0451 9.49614 16.8682L16.4961 12.8682C16.8077 12.6902 17 12.3589 17 12C17 11.6411 16.8077 11.3098 16.4961 11.1318L9.49614 7.13176ZM13.9844 12L10 14.2768V9.72318L13.9844 12Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 8.25027 0 6.3754 0.954915 5.06107C1.26331 4.6366 1.6366 4.26331 2.06107 3.95491C3.3754 3 5.25027 3 9 3H15C18.7497 3 20.6246 3 21.9389 3.95491C22.3634 4.26331 22.7367 4.6366 23.0451 5.06107C24 6.3754 24 8.25027 24 12C24 15.7497 24 17.6246 23.0451 18.9389C22.7367 19.3634 22.3634 19.7367 21.9389 20.0451C20.6246 21 18.7497 21 15 21H9C5.25027 21 3.3754 21 2.06107 20.0451C1.6366 19.7367 1.26331 19.3634 0.954915 18.9389C0 17.6246 0 15.7497 0 12ZM9 5H15C16.9194 5 18.1983 5.00275 19.1673 5.10773C20.0989 5.20866 20.504 5.38448 20.7634 5.57295C21.018 5.75799 21.242 5.98196 21.4271 6.23664C21.6155 6.49605 21.7913 6.90113 21.8923 7.83269C21.9973 8.80167 22 10.0806 22 12C22 13.9194 21.9973 15.1983 21.8923 16.1673C21.7913 17.0989 21.6155 17.504 21.4271 17.7634C21.242 18.018 21.018 18.242 20.7634 18.4271C20.504 18.6155 20.0989 18.7913 19.1673 18.8923C18.1983 18.9973 16.9194 19 15 19H9C7.08058 19 5.80167 18.9973 4.83269 18.8923C3.90113 18.7913 3.49605 18.6155 3.23664 18.4271C2.98196 18.242 2.75799 18.018 2.57295 17.7634C2.38448 17.504 2.20866 17.0989 2.10773 16.1673C2.00275 15.1983 2 13.9194 2 12C2 10.0806 2.00275 8.80167 2.10773 7.83269C2.20866 6.90113 2.38448 6.49605 2.57295 6.23664C2.75799 5.98196 2.98196 5.75799 3.23664 5.57295C3.49605 5.38448 3.90113 5.20866 4.83269 5.10773C5.80167 5.00275 7.08058 5 9 5Z" fill="currentColor"/></svg>`,
    image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clip-rule="evenodd" /></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    warn: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`
  };

  onMount(() => {
    const saved = localStorage.getItem('mp3_history');
    if (saved) history = JSON.parse(saved);
  });

  onDestroy(() => { if (pollInterval) clearInterval(pollInterval); });

  // --- YOUTUBE FUNCTIONS ---
  function handleYoutubeInput() {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      message = null;
    } else {
      videoId = null; thumbnailUrl = null;
    }
  }

  async function convertYoutube() {
    if (!url) return;
    isConverting = true; progress = 0; message = null;
    try {
      // Send downloadType (audio or video)
      const response = await fetch(`${BACKEND_URL}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, targetFolder: selectedFolder, mode: downloadType })
      });
      const data = await response.json();
      if (data.success) startPolling();
      else { isConverting = false; message = { type: 'error', text: data.error }; }
    } catch (err) { isConverting = false; message = { type: 'error', text: 'Connection failed.' }; }
  }

  async function saveYoutubeThumbnail() {
    if (!thumbnailUrl) return;
    imageLoading = true;
    try {
        const response = await fetch(`${BACKEND_URL}/save-thumbnail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: thumbnailUrl, videoId, targetFolder: selectedFolder, format: 'jpg' })
        });
        const data = await response.json();
        message = data.success ? { type: 'success', text: 'Thumbnail saved!' } : { type: 'error', text: 'Save failed' };
    } catch (e) { message = { type: 'error', text: 'Connection failed' }; } finally { imageLoading = false; }
  }

  // --- GENERAL IMAGE FUNCTIONS ---
  async function downloadGeneralImage() {
    if (!imageUrl) return;
    imageLoading = true; message = null;
    try {
        const response = await fetch(`${BACKEND_URL}/download-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl, targetFolder: selectedFolder, format: imageFormat })
        });
        const data = await response.json();
        message = data.success 
            ? { type: 'success', text: `Saved as .${imageFormat.toUpperCase()}!` } 
            : { type: 'error', text: 'Download failed' };
        
        // Add to history if successful
        if (data.success) {
            const newEntry = { url: imageUrl, date: new Date().toLocaleString(), id: Date.now() };
            history = [newEntry, ...history];
            localStorage.setItem('mp3_history', JSON.stringify(history));
        }

    } catch (e) { message = { type: 'error', text: 'Connection failed' }; } finally { imageLoading = false; }
  }

  // --- SHARED FUNCTIONS ---
  function startPolling() {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/progress`);
            const data = await res.json();
            progress = data.progress;
            if (data.status === 'completed') finishJob('success');
            else if (data.status === 'error') finishJob('error', data.error);
        } catch (e) { console.error('Polling error', e); }
    }, 500); 
  }

  function finishJob(status, errorText) {
    clearInterval(pollInterval);
    isConverting = false;
    if (status === 'success') {
        message = { type: 'success', text: 'Download successful!' };
        progress = 100;
        const newEntry = { url: url, date: new Date().toLocaleString(), id: Date.now() };
        history = [newEntry, ...history];
        localStorage.setItem('mp3_history', JSON.stringify(history));
        setTimeout(() => { progress = 0; url = ''; videoId = null; thumbnailUrl = null; }, 3000);
    } else {
        message = { type: 'error', text: errorText || 'Download failed.' };
    }
  }

  function clearHistory() { history = []; localStorage.removeItem('mp3_history'); }
  async function openFolder() {
    await fetch(`${BACKEND_URL}/open-folder`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetFolder: selectedFolder })
    });
  }
</script>

<main class="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
  
  <header class="bg-white border-b border-gray-200 py-4 shadow-sm sticky top-0 z-10">
    <div class="max-w-3xl mx-auto px-6 flex items-center gap-6">
      <div class="h-14 flex items-center">
        <img src="assets/1.png" alt="SOM MUSIC" class="h-full w-auto object-contain" />
      </div>
      <div class="flex flex-col justify-center">
        <h1 class="text-xl font-bold text-gray-900 leading-tight">Media Tool</h1>
        <p class="text-xs text-gray-500 font-medium">Local & Secure</p>
      </div>
    </div>
  </header>

  <div class="max-w-3xl mx-auto px-6 py-8">

    <!-- TAB SWITCHER -->
    <div class="flex gap-2 mb-6 p-1 bg-gray-200 rounded-xl w-full sm:w-auto self-start inline-flex">
        <button 
            on:click={() => { activeTab = 'youtube'; message = null; }}
            class="px-6 py-2 rounded-lg text-sm font-medium transition-all {activeTab === 'youtube' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
        >
            <div class="flex items-center gap-2">{@html icons.youtube} YouTube</div>
        </button>
        <button 
            on:click={() => { activeTab = 'image'; message = null; }}
            class="px-6 py-2 rounded-lg text-sm font-medium transition-all {activeTab === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
        >
            <div class="flex items-center gap-2">{@html icons.image} Image Tool</div>
        </button>
    </div>
    
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
      
      {#if isConverting || progress > 0}
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
            <div class="h-full bg-red-600 transition-all duration-300 ease-out" style="width: {progress}%"></div>
        </div>
      {/if}

      <!-- COMMON SETTINGS (Folder) -->
      <div class="mb-6">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            {@html icons.folder} Save Location
          </label>
          <div class="relative">
            <select bind:value={selectedFolder} class="w-full p-3 pl-4 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none appearance-none">
                <option value="downloads">System Downloads</option>
                <option value="desktop">Desktop</option>
                <option value="documents">Documents</option>
                <option value="app">App Folder</option>
            </select>
            <div class="absolute right-4 top-3.5 text-gray-500 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>
      </div>

      <!-- TAB 1: YOUTUBE DOWNLOADER -->
      {#if activeTab === 'youtube'}
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            {@html icons.youtube} YouTube Video URL
          </label>
          <div class="flex flex-col sm:flex-row gap-3">
            <input id="url" type="text" bind:value={url} on:input={handleYoutubeInput} disabled={isConverting} placeholder="Paste YouTube link here..." class="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-base disabled:bg-gray-100 disabled:text-gray-400"/>
          </div>

          <!-- Format Selection -->
          {#if videoId}
          <div class="mt-4 flex gap-4 animate-fade-in">
              <label class="flex items-center gap-2 cursor-pointer p-3 border rounded-lg {downloadType === 'audio' ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                  <input type="radio" bind:group={downloadType} value="audio" class="text-red-600 focus:ring-red-500">
                  <span class="text-sm font-medium">MP3 (Audio)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer p-3 border rounded-lg {downloadType === 'video' ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                  <input type="radio" bind:group={downloadType} value="video" class="text-red-600 focus:ring-red-500">
                  <span class="text-sm font-medium">MP4 (Video)</span>
              </label>
          </div>
          {/if}

          {#if videoId && thumbnailUrl}
            <div class="mt-6 border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col sm:flex-row gap-4 items-start animate-fade-in">
                <div class="w-full sm:w-48 aspect-video rounded-lg overflow-hidden shadow-sm bg-gray-200 relative">
                    <img src={thumbnailUrl} alt="Preview" class="w-full h-full object-cover" />
                </div>
                
                <div class="flex-1 w-full">
                    <p class="text-sm font-medium text-gray-900 mb-1">Video Found</p>
                    <div class="flex justify-between items-center mb-4">
                        <p class="text-xs text-gray-500">Ready to convert</p>
                        {#if isConverting}
                            <span class="text-xs font-bold text-red-600 animate-pulse">{progress.toFixed(0)}%</span>
                        {/if}
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <button on:click={convertYoutube} disabled={isConverting} class="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {#if isConverting}
                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Downloading...
                            {:else}
                                {@html icons.download}
                                Download {downloadType.toUpperCase()}
                            {/if}
                        </button>
                        
                        <!-- Thumbnail Saver -->
                        <button on:click={saveYoutubeThumbnail} disabled={imageLoading} class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50">
                            {@html icons.image} Cover
                        </button>
                    </div>
                </div>
            </div>
          {/if}
      {/if}

      <!-- TAB 2: IMAGE DOWNLOADER -->
      {#if activeTab === 'image'}
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            {@html icons.image} Image URL
          </label>
          <div class="flex flex-col gap-3">
            <input type="text" bind:value={imageUrl} placeholder="https://example.com/image.jpg" class="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-base"/>
            
            <div class="flex flex-col sm:flex-row gap-3 items-center">
                <div class="w-full sm:w-auto flex items-center gap-2">
                    <span class="text-sm text-gray-600">Save as:</span>
                    <select bind:value={imageFormat} class="p-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-red-500">
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="svg">SVG</option>
                    </select>
                </div>

                <button 
                    on:click={downloadGeneralImage} 
                    disabled={imageLoading || !imageUrl} 
                    class="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {#if imageLoading}
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {:else}
                        {@html icons.download} Download Image
                    {/if}
                </button>
            </div>
          </div>
      {/if}

      {#if message}
        <div class="mt-6 p-4 rounded-xl text-sm flex items-center gap-3 {message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}">
          {@html message.type === 'success' ? icons.check : icons.warn}
          {message.text}
        </div>
      {/if}
    </div>

    <!-- HISTORY -->
    {#if history.length > 0}
      <div class="mt-12">
        <div class="flex items-center justify-between mb-6 px-1">
          <h2 class="text-xl font-bold text-gray-800">History</h2>
          <div class="flex gap-4">
             <button on:click={openFolder} class="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 transition">{@html icons.folder} Open Folder</button>
            <button on:click={clearHistory} class="text-sm text-gray-400 hover:text-red-600 font-medium flex items-center gap-1.5 transition">{@html icons.trash} Clear</button>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {#each history as item}
            <div class="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition flex justify-between items-center group">
              <div><p class="text-sm font-medium text-gray-900 truncate max-w-md">{item.url}</p><p class="text-xs text-gray-400 mt-1">{item.date}</p></div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</main>