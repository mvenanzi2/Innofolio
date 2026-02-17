import Foundation

class APIService {
    static let shared = APIService()
    
    // TODO: Replace with your deployed backend URL
    private let baseURL = "http://localhost:3000/api"
    
    private var token: String? {
        get { UserDefaults.standard.string(forKey: "authToken") }
        set { UserDefaults.standard.set(newValue, forKey: "authToken") }
    }
    
    private func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError(httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }
    
    // MARK: - Auth
    
    func login(email: String, password: String) async throws -> AuthResponse {
        let body = ["email": email, "password": password]
        let response: AuthResponse = try await request(endpoint: "/auth/login", method: "POST", body: body)
        token = response.token
        return response
    }
    
    func signup(email: String, username: String, password: String, teamName: String?) async throws -> AuthResponse {
        let body: [String: Any?] = [
            "email": email,
            "username": username,
            "password": password,
            "teamName": teamName
        ]
        let response: AuthResponse = try await request(endpoint: "/auth/signup", method: "POST", body: body)
        token = response.token
        return response
    }
    
    func getCurrentUser() async throws -> User {
        return try await request(endpoint: "/auth/me")
    }
    
    func logout() {
        token = nil
    }
    
    // MARK: - Ideas
    
    func getIdeas(stageGate: StageGate? = nil, search: String? = nil, tag: String? = nil) async throws -> [Idea] {
        var endpoint = "/ideas?"
        if let stageGate = stageGate {
            endpoint += "stageGate=\(stageGate.rawValue)&"
        }
        if let search = search, !search.isEmpty {
            endpoint += "search=\(search)&"
        }
        if let tag = tag, !tag.isEmpty {
            endpoint += "tag=\(tag)&"
        }
        return try await request(endpoint: endpoint)
    }
    
    func getIdea(id: String) async throws -> Idea {
        return try await request(endpoint: "/ideas/\(id)")
    }
    
    func createIdea(title: String, description: String, opportunity: String?, tags: String?) async throws -> Idea {
        let body: [String: Any?] = [
            "title": title,
            "description": description,
            "opportunity": opportunity,
            "tags": tags
        ]
        return try await request(endpoint: "/ideas", method: "POST", body: body)
    }
    
    func updateIdea(id: String, title: String?, description: String?, opportunity: String?, tags: String?, stageGate: StageGate?) async throws -> Idea {
        let body: [String: Any?] = [
            "title": title,
            "description": description,
            "opportunity": opportunity,
            "tags": tags,
            "stageGate": stageGate?.rawValue
        ]
        return try await request(endpoint: "/ideas/\(id)", method: "PUT", body: body)
    }
    
    func deleteIdea(id: String) async throws {
        let _: EmptyResponse = try await request(endpoint: "/ideas/\(id)", method: "DELETE")
    }
}

// MARK: - Models

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct EmptyResponse: Codable {}

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case serverError(Int)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .serverError(let code):
            return "Server error: \(code)"
        }
    }
}
