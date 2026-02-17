import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var ideas: [Idea] = []
    @State private var searchText = ""
    @State private var selectedStage: StageGate?
    @State private var showCreateIdea = false
    @State private var showProfile = false
    @State private var isLoading = false
    
    var filteredIdeas: [Idea] {
        ideas.filter { idea in
            let matchesSearch = searchText.isEmpty || 
                idea.title.localizedCaseInsensitiveContains(searchText) ||
                idea.description.localizedCaseInsensitiveContains(searchText)
            let matchesStage = selectedStage == nil || idea.stageGate == selectedStage
            return matchesSearch && matchesStage
        }
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                LinearGradient(
                    colors: [Color(red: 0.95, green: 0.95, blue: 1), Color(red: 0.98, green: 0.95, blue: 1)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Search and Filter
                    VStack(spacing: 12) {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                            TextField("Search ideas...", text: $searchText)
                        }
                        .padding()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                FilterChip(title: "All", isSelected: selectedStage == nil) {
                                    selectedStage = nil
                                }
                                
                                ForEach(StageGate.allCases, id: \.self) { stage in
                                    FilterChip(title: stage.displayName, isSelected: selectedStage == stage) {
                                        selectedStage = stage
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                    
                    // Ideas Grid
                    if isLoading {
                        Spacer()
                        ProgressView()
                        Spacer()
                    } else if filteredIdeas.isEmpty {
                        Spacer()
                        VStack(spacing: 16) {
                            Image(systemName: "lightbulb")
                                .font(.system(size: 60))
                                .foregroundColor(.gray.opacity(0.5))
                            Text("No ideas yet")
                                .font(.title3)
                                .foregroundColor(.gray)
                            Text("Create your first one!")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                        Spacer()
                    } else {
                        ScrollView {
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                                ForEach(filteredIdeas) { idea in
                                    NavigationLink(destination: IdeaDetailView(ideaId: idea.id)) {
                                        IdeaCardView(idea: idea)
                                    }
                                }
                            }
                            .padding()
                        }
                    }
                }
            }
            .navigationTitle("Innofolio")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { showProfile = true }) {
                        Image(systemName: "person.circle.fill")
                            .font(.title3)
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.blue, .purple],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showCreateIdea = true }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.title3)
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [.blue, .purple],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                    }
                }
            }
            .sheet(isPresented: $showCreateIdea) {
                CreateIdeaView(onCreated: loadIdeas)
            }
            .sheet(isPresented: $showProfile) {
                ProfileView()
            }
            .task {
                await loadIdeas()
            }
            .refreshable {
                await loadIdeas()
            }
        }
    }
    
    private func loadIdeas() async {
        isLoading = true
        do {
            ideas = try await APIService.shared.getIdeas()
        } catch {
            print("Error loading ideas: \(error)")
        }
        isLoading = false
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(
                    isSelected ?
                    LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing) :
                    LinearGradient(colors: [.white, .white], startPoint: .leading, endPoint: .trailing)
                )
                .foregroundColor(isSelected ? .white : .gray)
                .cornerRadius(20)
                .shadow(color: .black.opacity(0.05), radius: 3, x: 0, y: 2)
        }
    }
}
