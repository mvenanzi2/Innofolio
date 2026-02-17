import Foundation

@MainActor
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var errorMessage: String?
    
    init() {
        checkAuthStatus()
    }
    
    func checkAuthStatus() {
        if UserDefaults.standard.string(forKey: "authToken") != nil {
            Task {
                do {
                    currentUser = try await APIService.shared.getCurrentUser()
                    isAuthenticated = true
                } catch {
                    isAuthenticated = false
                    APIService.shared.logout()
                }
            }
        }
    }
    
    func login(email: String, password: String) async {
        do {
            let response = try await APIService.shared.login(email: email, password: password)
            currentUser = response.user
            isAuthenticated = true
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func signup(email: String, username: String, password: String, teamName: String?) async {
        do {
            let response = try await APIService.shared.signup(
                email: email,
                username: username,
                password: password,
                teamName: teamName
            )
            currentUser = response.user
            isAuthenticated = true
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func logout() {
        APIService.shared.logout()
        isAuthenticated = false
        currentUser = nil
    }
}
