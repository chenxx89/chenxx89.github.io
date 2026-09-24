/* Standalone project page: no framework, build step, or third-party CDN. */
"use strict";

(() => {
  const config = window.FASTVR_SITE;
  const results = window.FASTVR_RESULTS;
  const $ = (selector) => document.querySelector(selector);

  if (config.paperUrl) {
    const paper = $("#paper-link");
    paper.href = config.paperUrl;
    paper.target = "_blank";
    paper.rel = "noopener noreferrer";
    paper.classList.remove("unavailable");
    paper.removeAttribute("aria-disabled");
    paper.removeAttribute("title");
    paper.querySelector(".soon").remove();
  }

  // No long-video URL is attached until an explicit play click. Only two reusable
  // elements own sources; switching detaches the old pair and cancels loading.
  const player = $("#comparison");
  const stage = $("#video-stage");
  const hq = $("#video-hq");
  const lq = $("#video-lq");
  const videos = [hq, lq];
  const seek = $("#seek-slider");
  const play = $("#play-toggle");
  const message = $("#player-message");
  let wanted = false;
  let sourcesLoaded = false;
  let visible = false;
  let activeDemo = 0;
  let generation = 0;
  let pendingPlay = false;
  let seeking = false;
  let failed = false;
  let frameRequest = null;

  function timeLabel(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const total = Math.max(0, Math.floor(seconds));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  function duration() {
    const durations = videos.map((v) => v.duration);
    return durations.every((d) => Number.isFinite(d) && d > 0)
      ? Math.min(...durations) : 0;
  }

  function showMessage(text = "") {
    message.textContent = text;
    message.hidden = !text;
  }

  function updatePlayButton(playing) {
    play.setAttribute("aria-label", playing ? "Pause comparison" : "Play comparison");
    play.querySelector("use").setAttribute("href", playing ? "#i-pause" : "#i-play");
  }

  function stopClock() {
    if (frameRequest === null) return;
    if (hq.cancelVideoFrameCallback) hq.cancelVideoFrameCallback(frameRequest);
    else cancelAnimationFrame(frameRequest);
    frameRequest = null;
  }

  function pause() {
    videos.forEach((video) => video.pause());
    stopClock();
    updatePlayButton(false);
  }

  function updateTime() {
    const length = duration();
    $("#current-time").textContent = timeLabel(hq.currentTime);
    $("#duration").textContent = timeLabel(length);
    if (!seeking) seek.value = length ? String(hq.currentTime / length * 1000) : "0";
    seek.setAttribute("aria-valuetext", `${timeLabel(hq.currentTime)} of ${timeLabel(length)}`);
  }

  function scheduleClock() {
    if (frameRequest !== null || hq.paused || !visible || document.hidden) return;
    const tick = () => {
      frameRequest = null;
      if (hq.paused || !visible || document.hidden) return;
      if (!seeking && !lq.seeking && Math.abs(lq.currentTime - hq.currentTime) > 0.06) {
        lq.currentTime = hq.currentTime;
      }
      updateTime();
      scheduleClock();
    };
    frameRequest = hq.requestVideoFrameCallback
      ? hq.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
  }

  async function start() {
    if (!sourcesLoaded || !wanted || !visible || document.hidden || failed || seeking || pendingPlay) return;
    if (videos.some((video) => video.readyState < 3)) return;
    pendingPlay = true;
    const version = generation;
    try {
      await Promise.all(videos.map((video) => video.play()));
      if (version !== generation) return;
      if (!wanted || !visible || document.hidden || seeking) { pause(); return; }
      showMessage();
      updatePlayButton(true);
      scheduleClock();
    } catch (error) {
      if (version !== generation) return;
      pause();
      if (error.name === "NotAllowedError") {
        wanted = false;
        showMessage("Press play to start the comparison.");
      } else if (error.name !== "AbortError") {
        failed = true;
        showMessage("Video playback failed. Please check the media files or try another browser.");
      }
    } finally {
      if (version === generation) pendingPlay = false;
    }
  }

  function loadSelectedSources() {
    if (sourcesLoaded) return;
    sourcesLoaded = true;
    const demo = config.demos[activeDemo];
    showMessage("Loading comparison…");
    for (const [i, video] of videos.entries()) {
      video.preload = wanted && visible ? "auto" : "metadata";
      video.src = i === 0 ? demo.hq : demo.lq;
      video.load();
    }
  }

  function loadDemo(index) {
    if (!config.demos.length) return;
    activeDemo = (index + config.demos.length) % config.demos.length;
    generation += 1;
    pendingPlay = false;
    failed = false;
    seeking = false;
    pause();
    sourcesLoaded = false;
    wanted = false;
    const demo = config.demos[activeDemo];
    showMessage("Press play to load this video.");
    $("#demo-count").textContent = `${String(activeDemo + 1).padStart(2, "0")} / ${String(config.demos.length).padStart(2, "0")}`;
    for (const [i, video] of videos.entries()) {
      video.removeAttribute("src");
      video.preload = "none";
      video.load();
      video.poster = i === 0 ? demo.outputPoster : demo.poster;
      video.setAttribute("aria-label", `${demo.category} ${demo.title}: ${i === 0 ? "FastVR enhanced video (ours)" : "original input video"}`);
    }
    stage.style.setProperty("--split", "50%");
    $("#compare-slider").value = "50";
    $("#compare-slider").setAttribute("aria-valuetext", "50% LQ, 50% HQ");
    $("#demo-buttons").querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.demoIndex) === activeDemo));
    });
    updateTime();
  }

  const demoGroups = new Map([...document.querySelectorAll("[data-demo-category]")]
    .map((group) => [group.dataset.demoCategory, group]));
  config.demos.forEach((demo, index) => {
    const button = document.createElement("button");
    button.className = "demo-button";
    button.dataset.demoIndex = String(index);
    button.setAttribute("aria-label", `Show ${demo.category} ${demo.title}`);
    button.setAttribute("aria-pressed", "false");
    const image = document.createElement("img");
    image.src = demo.poster;
    image.alt = "";
    image.width = 48;
    image.height = 80;
    const label = document.createElement("span");
    label.className = "demo-label";
    label.textContent = `${demo.category} · ${demo.title}`;
    button.append(image, label);
    button.addEventListener("click", () => loadDemo(index));
    demoGroups.get(demo.category).append(button);
  });
  $("#previous-demo").addEventListener("click", () => loadDemo(activeDemo - 1));
  $("#next-demo").addEventListener("click", () => loadDemo(activeDemo + 1));
  $("#compare-slider").addEventListener("input", (event) => {
    const position = Number(event.target.value);
    stage.style.setProperty("--split", `${position}%`);
    event.target.setAttribute("aria-valuetext", `${position}% LQ, ${100 - position}% HQ`);
  });
  play.addEventListener("click", () => {
    wanted = !sourcesLoaded || !wanted;
    if (wanted) {
      loadSelectedSources();
      videos.forEach((video) => { video.preload = "auto"; });
      start();
    }
    else pause();
  });
  seek.addEventListener("input", () => {
    const length = duration();
    if (!length) return;
    seeking = true;
    pause();
    const time = Math.min(length - 0.001, Number(seek.value) / 1000 * length);
    videos.forEach((video) => { video.currentTime = time; });
    $("#current-time").textContent = timeLabel(time);
  });
  seek.addEventListener("change", () => { seeking = false; start(); updateTime(); });
  videos.forEach((video) => {
    video.addEventListener("loadedmetadata", () => {
      if (hq.videoWidth && hq.videoHeight) stage.style.aspectRatio = `${hq.videoWidth} / ${hq.videoHeight}`;
      updateTime();
    });
    video.addEventListener("canplay", () => {
      if (sourcesLoaded && videos.every((v) => v.readyState >= 3) && !failed) { showMessage(); start(); }
    });
    video.addEventListener("waiting", () => {
      if (wanted && visible && !seeking && !failed) {
        pause();
        showMessage("Buffering both videos…");
      }
    });
    video.addEventListener("seeked", () => { if (!seeking) start(); });
    video.addEventListener("error", () => {
      if (!sourcesLoaded || !video.getAttribute("src")) return;
      failed = true;
      pause();
      showMessage("Video unavailable. Check the file path and use a browser with HEVC support.");
    });
  });
  hq.addEventListener("timeupdate", updateTime);
  // Restart together, avoiding independently looping players drifting apart.
  function restart() {
    if (seeking || !wanted || failed) return;
    pause();
    videos.forEach((video) => { video.currentTime = 0; });
    start();
  }
  videos.forEach((video) => video.addEventListener("ended", restart));

  function stopLongVideo() {
    wanted = false;
    pause();
  }
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stopLongVideo();
  }, { threshold:0.05 });
  visibilityObserver.observe(player);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopLongVideo(); });
  window.addEventListener("pagehide", stopLongVideo);

  const fullscreen = $("#fullscreen-toggle");
  fullscreen.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (player.requestFullscreen) await player.requestFullscreen();
      else if (player.webkitRequestFullscreen) player.webkitRequestFullscreen();
      else showMessage("Fullscreen is unavailable in this browser. Use landscape mode for a larger view.");
    } catch { showMessage("Fullscreen is unavailable in this browser."); }
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreen.setAttribute("aria-label", document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen");
  });
  // Initial display and every selection use only PNG covers.
  loadDemo(0);

  // Both charts deliberately share one fixed method order.
  for (const [selector, metric, maximum] of [["#speed-chart", "fps", 12], ["#memory-chart", "memory", 90]]) {
    const chart = $(selector);
    const descriptions = [];
    results.efficiency.forEach((record) => {
      const row = document.createElement("div");
      row.className = `bar-row${record.method === "FastVR" ? " ours" : ""}`;
      const name = document.createElement("span");
      name.textContent = record.method;
      const track = document.createElement("div");
      track.className = "bar-track";
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.setProperty("--value", `${record[metric] / maximum * 100}%`);
      track.append(bar);
      const value = document.createElement("span");
      value.className = "bar-value";
      value.textContent = record[metric].toFixed(2);
      row.append(name, track, value);
      chart.append(row);
      descriptions.push(`${record.method}: ${record[metric].toFixed(2)}`);
    });
    chart.setAttribute("aria-label", `${metric === "fps" ? "Frames per second" : "Peak GPU memory in GB"}. ${descriptions.join("; ")}`);
  }

  function renderDataset(index) {
    const dataset = results.datasets[index];
    const table = $("#results-table");
    table.style.setProperty("--metric-count", dataset.metrics.length);
    table.caption.textContent = `Quantitative comparison on ${dataset.name}`;
    $("#dataset-caption").textContent = `${dataset.name} · ${dataset.type}`;
    $("#dataset-buttons").querySelectorAll("button").forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    const head = document.createElement("tr");
    ["Method", ...dataset.metrics.map((m) => `${m.name} ${m.higherIsBetter ? "↑" : "↓"}`)].forEach((name) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = name;
      head.append(th);
    });
    table.tHead.replaceChildren(head);
    const body = document.createDocumentFragment();
    const rankings = dataset.metrics.map((metric) => [...new Set(metric.values.map(Number))].sort((a, b) => metric.higherIsBetter ? b - a : a - b));
    results.methods.forEach((method, i) => {
      const row = document.createElement("tr");
      if (method === "FastVR") row.classList.add("ours");
      if (method === "Vivid-VR") row.classList.add("group-boundary");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = method === "FastVR" ? "FastVR (Ours)" : method;
      row.append(th);
      dataset.metrics.forEach((metric, j) => {
        const td = document.createElement("td");
        td.textContent = metric.values[i];
        const rank = rankings[j].indexOf(Number(metric.values[i]));
        if (rank < 2) { td.className = rank === 0 ? "best" : "second"; td.title = rank === 0 ? "Best" : "Second best"; }
        row.append(td);
      });
      body.append(row);
    });
    table.tBodies[0].replaceChildren(body);
  }
  results.datasets.forEach((dataset, index) => {
    const button = document.createElement("button");
    button.textContent = dataset.name;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => renderDataset(index));
    $("#dataset-buttons").append(button);
  });
  renderDataset(0);

  // One reusable player for all pre-composited comparisons, independent of image tabs.
  const comparisonCard = $("#comparison-video");
  const comparisonVideo = comparisonCard.querySelector("video");
  const comparisonClips = config.comparisonClips;
  const clipButtons = $("#comparison-clip-buttons");
  const clipError = comparisonCard.querySelector(".stitched-error");
  let activeClip = 0;
  let clipGeneration = 0;
  let clipVisible = false;
  let clipAutoplayPending = false;
  // Load only the selected clip (including the first); start it when visible.
  // Switching detaches the previous source before attaching the new one.
  function selectComparisonClip(index) {
    clipGeneration += 1;
    activeClip = (index + comparisonClips.length) % comparisonClips.length;
    const clip = comparisonClips[activeClip];
    comparisonVideo.pause();
    comparisonVideo.removeAttribute("src");
    comparisonVideo.preload = "none";
    comparisonVideo.load();
    comparisonVideo.style.aspectRatio = `${clip.width} / ${clip.height}`;
    comparisonVideo.setAttribute("aria-label", clip.title);
    clipError.hidden = true;
    $("#comparison-clip-count").textContent = `${String(activeClip + 1).padStart(2, "0")} / ${String(comparisonClips.length).padStart(2, "0")}`;
    clipButtons.querySelectorAll("button").forEach((button, i) => {
      button.setAttribute("aria-pressed", String(i === activeClip));
    });
    clipAutoplayPending = true;
    comparisonVideo.preload = "metadata";
    comparisonVideo.src = clip.src;
    comparisonVideo.load();
    playComparisonClip();
  }
  async function playComparisonClip() {
    if (!clipAutoplayPending || !clipVisible || document.hidden) return;
    const version = clipGeneration;
    clipError.hidden = true;
    try {
      await comparisonVideo.play();
    } catch (error) {
      if (version !== clipGeneration || error.name === "AbortError") return;
      clipAutoplayPending = false;
      clipError.textContent = error.name === "NotAllowedError"
        ? "Press the video play control to start playback."
        : "Video unavailable. Check the file path and use a browser with HEVC support.";
      clipError.hidden = false;
    }
  }
  comparisonClips.forEach((clip, index) => {
    const button = document.createElement("button");
    button.textContent = `Video ${String(index + 1).padStart(2, "0")}`;
    button.setAttribute("aria-label", `Show ${clip.title}`);
    button.addEventListener("click", () => selectComparisonClip(index));
    clipButtons.append(button);
  });
  $("#previous-comparison-clip").addEventListener("click", () => selectComparisonClip(activeClip - 1));
  $("#next-comparison-clip").addEventListener("click", () => selectComparisonClip(activeClip + 1));
  comparisonVideo.addEventListener("loadedmetadata", () => {
    if (comparisonVideo.videoWidth && comparisonVideo.videoHeight) {
      comparisonVideo.style.aspectRatio = `${comparisonVideo.videoWidth} / ${comparisonVideo.videoHeight}`;
    }
  });
  comparisonVideo.addEventListener("error", () => {
    if (!comparisonVideo.getAttribute("src") || !comparisonVideo.error) return;
    clipError.textContent = "Video unavailable. Check the file path and use a browser with HEVC support.";
    clipError.hidden = false;
  });
  comparisonVideo.addEventListener("playing", () => {
    if (!clipVisible || document.hidden) { comparisonVideo.pause(); return; }
    clipAutoplayPending = false;
    clipError.hidden = true;
  });
  const clipObserver = new IntersectionObserver(([entry]) => {
    clipVisible = entry.isIntersecting;
    if (clipVisible) playComparisonClip();
    else comparisonVideo.pause();
  }, { threshold:0 });
  selectComparisonClip(0);
  clipObserver.observe(comparisonVideo);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) comparisonVideo.pause();
    else playComparisonClip();
  });
  window.addEventListener("pagehide", () => comparisonVideo.pause());

  const visualTabs = [...document.querySelectorAll(".visual-tabs [role=tab]")];
  function selectVisualTab(selected) {
    visualTabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));
      panel.hidden = !active;
    });
  }
  visualTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectVisualTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % visualTabs.length;
      else if (event.key === "ArrowLeft") next = (index + visualTabs.length - 1) % visualTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = visualTabs.length - 1;
      else return;
      event.preventDefault();
      visualTabs[next].focus();
      selectVisualTab(visualTabs[next]);
    });
  });

  // Each category remembers its own position; no automatic carousel playback.
  document.querySelectorAll("[data-figure-gallery]").forEach((gallery) => {
    const slides = [...gallery.querySelectorAll(".paper-figure")];
    const counter = gallery.querySelector(".figure-gallery-count");
    let current = 0;
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== current; });
      counter.textContent = `Image ${String(current + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
    gallery.querySelector(".previous-figure").addEventListener("click", () => showSlide(current - 1));
    gallery.querySelector(".next-figure").addEventListener("click", () => showSlide(current + 1));
  });

  const dialog = $("#figure-dialog");
  const figureViewport = $("#figure-viewport");
  const figureSizeToggle = $("#figure-size-toggle");
  function setOriginalImageSize(original) {
    figureViewport.classList.toggle("original-size", original);
    figureSizeToggle.setAttribute("aria-pressed", String(original));
    figureViewport.scrollTop = 0;
    figureViewport.scrollLeft = 0;
  }
  figureSizeToggle.addEventListener("click", () => {
    setOriginalImageSize(figureSizeToggle.getAttribute("aria-pressed") !== "true");
  });
  document.querySelectorAll("[data-figure]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#enlarged-figure").src = button.dataset.figure;
      $("#enlarged-figure").alt = button.dataset.caption;
      $("#figure-dialog-title").textContent = button.dataset.caption;
      setOriginalImageSize(false);
      dialog.showModal();
    });
  });
  $("#close-figure").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  $("#copy-citation").addEventListener("click", async () => {
    const text = $("#bibtex").textContent;
    const buttonLabel = $("#copy-citation span");
    const status = $("#copy-status");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      buttonLabel.textContent = "Copied!";
      status.textContent = "Citation copied to clipboard.";
      setTimeout(() => { buttonLabel.textContent = "Copy citation"; }, 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents($("#bibtex"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      buttonLabel.textContent = "Press Ctrl/Cmd+C";
      status.textContent = "Citation selected. Press Control+C or Command+C to copy.";
    }
  });

  const navLinks = [...document.querySelectorAll("nav a")];
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { rootMargin:"-15% 0px -60% 0px", threshold:0 });
  sectionObserver.observe($("#top"));
  navLinks.forEach((link) => sectionObserver.observe($(link.hash)));
})();
