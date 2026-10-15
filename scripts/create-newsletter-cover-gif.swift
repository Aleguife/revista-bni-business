import AppKit
import ImageIO
import UniformTypeIdentifiers

guard CommandLine.arguments.count == 3 else {
  fputs("Uso: create-newsletter-cover-gif.swift entrada.webp saida.gif\n", stderr)
  exit(1)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let outputWidth = 640
let frameCount = 14
let frameDelay = 0.16

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
  fputs("Não foi possível abrir a capa de origem.\n", stderr)
  exit(1)
}

let aspectRatio = CGFloat(image.height) / CGFloat(image.width)
let outputHeight = Int((CGFloat(outputWidth) * aspectRatio).rounded())
let colorSpace = CGColorSpaceCreateDeviceRGB()

guard let destination = CGImageDestinationCreateWithURL(
  outputURL as CFURL,
  UTType.gif.identifier as CFString,
  frameCount,
  nil
) else {
  fputs("Não foi possível criar o GIF de saída.\n", stderr)
  exit(1)
}

let gifProperties: [CFString: Any] = [
  kCGImagePropertyGIFDictionary: [
    kCGImagePropertyGIFLoopCount: 0
  ]
]
CGImageDestinationSetProperties(destination, gifProperties as CFDictionary)

for index in 0..<frameCount {
  let phase = CGFloat(index) / CGFloat(frameCount - 1)
  let zoom = 1.0 + (0.045 * sin(phase * .pi))
  let frameSize = CGSize(width: outputWidth, height: outputHeight)

  guard let context = CGContext(
    data: nil,
    width: outputWidth,
    height: outputHeight,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else { continue }

  context.interpolationQuality = .high
  context.setFillColor(NSColor.white.cgColor)
  context.fill(CGRect(origin: .zero, size: frameSize))

  let scaledSize = CGSize(width: frameSize.width * zoom, height: frameSize.height * zoom)
  let origin = CGPoint(
    x: (frameSize.width - scaledSize.width) / 2,
    y: (frameSize.height - scaledSize.height) / 2
  )
  context.draw(image, in: CGRect(origin: origin, size: scaledSize))

  guard let frame = context.makeImage() else { continue }
  let frameProperties: [CFString: Any] = [
    kCGImagePropertyGIFDictionary: [
      kCGImagePropertyGIFDelayTime: frameDelay
    ]
  ]
  CGImageDestinationAddImage(destination, frame, frameProperties as CFDictionary)
}

guard CGImageDestinationFinalize(destination) else {
  fputs("Não foi possível finalizar o GIF.\n", stderr)
  exit(1)
}

print("GIF criado em \(outputURL.path)")
