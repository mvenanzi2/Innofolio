import Foundation

enum StageGate: String, Codable, CaseIterable {
    case idea = "IDEA"
    case inDevelopment = "IN_DEVELOPMENT"
    case launched = "LAUNCHED"
    case sidelined = "SIDELINED"
    
    var displayName: String {
        switch self {
        case .idea: return "Idea"
        case .inDevelopment: return "In Development"
        case .launched: return "Launched"
        case .sidelined: return "Sidelined"
        }
    }
}

struct Idea: Identifiable, Codable {
    let id: String
    let ideaNumber: Int
    var title: String
    var description: String
    var opportunity: String?
    var tags: String?
    var stageGate: StageGate
    let createdAt: Date
    let updatedAt: Date
    let authorId: String
    var collaborators: [User]
    
    var tagArray: [String] {
        guard let tags = tags else { return [] }
        return tags.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
    }
}

struct User: Identifiable, Codable {
    let id: String
    let email: String
    let username: String?
    let teamId: String?
}
