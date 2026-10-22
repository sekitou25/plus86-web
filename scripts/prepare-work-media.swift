import Foundation
import AVFoundation
import AppKit

// Keep the supplied recordings untouched; publish small, silent web derivatives.
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let jobs = [
    ("qishui", "ScreenRecording_10-20-2026 11-36-19_1.MP4", "player"),
    ("qishui", "ScreenRecording_10-20-2026 11-36-51_1.MP4", "lyrics"),
    ("qishui", "ScreenRecording_10-20-2026 11-37-09_1.MP4", "discovery"),
    ("talkie", "ScreenRecording_10-20-2026 11-41-14_1.MP4", "conversation"),
    ("wechat", "reading-original.mp4", "reading")
]
let inspectOnly = CommandLine.arguments.contains("--inspect")
let includeStills = CommandLine.arguments.contains("--stills")
let projectFlag = CommandLine.arguments.firstIndex(of: "--project")
if let index = projectFlag, index + 1 >= CommandLine.arguments.count {
    fatalError("--project requires a project name")
}
let selectedProject = projectFlag.map { CommandLine.arguments[$0 + 1] }
if let project = selectedProject, !jobs.contains(where: { $0.0 == project }) {
    fatalError("Unknown media project: \(project)")
}
for (project, filename, name) in jobs where selectedProject == nil || selectedProject == project {
    let source = root.appendingPathComponent("content/works/\(project)/\(filename)")
    let asset = AVURLAsset(url: source)
    let duration = CMTimeGetSeconds(asset.duration)
    guard let track = asset.tracks(withMediaType: .video).first else { fatalError("Missing video: \(source.path)") }
    let rect = CGRect(origin: .zero, size: track.naturalSize).applying(track.preferredTransform)
    let output = inspectOnly ? URL(fileURLWithPath: "/private/tmp/plus86-work-inspection") : root.appendingPathComponent("content/media/works/\(project)")
    try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)
    print("\(project)/\(name): \(Int(abs(rect.width)))×\(Int(abs(rect.height))), \(String(format: "%.1f", duration)) seconds")
    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.maximumSize = CGSize(width: 720, height: 1560)
    for (index, fraction) in [0.08, 0.38, 0.72].enumerated() {
        let frame = try generator.copyCGImage(at: CMTime(seconds: max(0.2, duration * fraction), preferredTimescale: 600), actualTime: nil)
        let bitmap = NSBitmapImageRep(cgImage: frame)
        let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!
        let name = inspectOnly ? "\(project)-\(name)-frame-\(index).jpg" : "\(name)-poster.jpg"
        if inspectOnly || index == 0 { try data.write(to: output.appendingPathComponent(name)) }
        if !inspectOnly && includeStills && index > 0 {
            try data.write(to: output.appendingPathComponent("\(name.replacingOccurrences(of: "-poster.jpg", with: ""))-still-\(index).jpg"))
        }
    }
    if inspectOnly { continue }
    let destination = output.appendingPathComponent("\(name).mp4")
    if FileManager.default.fileExists(atPath: destination.path), !CommandLine.arguments.contains("--rebuild") { print("  existing web recording retained"); continue }
    let temporary = output.appendingPathComponent(".\(name)-encoding.mp4")
    if FileManager.default.fileExists(atPath: temporary.path) { try FileManager.default.removeItem(at: temporary) }
    let reader = try AVAssetReader(asset: asset)
    let render = AVMutableVideoComposition()
    let scale = 540 / abs(rect.width)
    render.renderSize = CGSize(width: 540, height: (abs(rect.height) * scale / 2).rounded() * 2)
    render.frameDuration = CMTime(value: 1, timescale: 30)
    let instruction = AVMutableVideoCompositionInstruction()
    instruction.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
    let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: track)
    let transform = track.preferredTransform.concatenating(CGAffineTransform(translationX: -rect.minX, y: -rect.minY)).concatenating(CGAffineTransform(scaleX: scale, y: scale))
    layer.setTransform(transform, at: .zero)
    instruction.layerInstructions = [layer]
    render.instructions = [instruction]
    let frames = AVAssetReaderVideoCompositionOutput(videoTracks: [track], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
    frames.videoComposition = render
    reader.add(frames)
    let writer = try AVAssetWriter(outputURL: temporary, fileType: .mp4)
    writer.shouldOptimizeForNetworkUse = true
    let input = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: Int(render.renderSize.width), AVVideoHeightKey: Int(render.renderSize.height), AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 1_200_000, AVVideoMaxKeyFrameIntervalKey: 60, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]])
    input.expectsMediaDataInRealTime = false
    writer.add(input)
    guard writer.startWriting(), reader.startReading() else { fatalError("Could not start encoding") }
    writer.startSession(atSourceTime: .zero)
    let completed = DispatchSemaphore(value: 0)
    input.requestMediaDataWhenReady(on: DispatchQueue(label: "work-media-encoding")) {
        while input.isReadyForMoreMediaData {
            guard let sample = frames.copyNextSampleBuffer() else {
                input.markAsFinished()
                writer.finishWriting { completed.signal() }
                return
            }
            guard input.append(sample) else { reader.cancelReading(); input.markAsFinished(); completed.signal(); return }
        }
    }
    completed.wait()
    guard writer.status == .completed, reader.status == .completed else { fatalError("Export failed: \(String(describing: writer.error ?? reader.error))") }
    if FileManager.default.fileExists(atPath: destination.path) { _ = try FileManager.default.replaceItemAt(destination, withItemAt: temporary) }
    else { try FileManager.default.moveItem(at: temporary, to: destination) }
    let size = (try FileManager.default.attributesOfItem(atPath: destination.path)[.size] as! NSNumber).doubleValue / 1_000_000
    print("  web recording: \(String(format: "%.1f", size)) MB (silent)")
}
