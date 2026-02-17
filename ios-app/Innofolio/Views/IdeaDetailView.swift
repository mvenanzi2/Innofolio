import SwiftUI

struct IdeaDetailView: View {
    let ideaId: String
    @Environment(\.dismiss) var dismiss
    
    @State private var idea: Idea?
    @State private var isLoading = true
    @State private var showEditSheet = false
    @State private var showDeleteAlert = false
    
    var body: some View {
        ZStack {
            if isLoading {
                ProgressView()
            } else if let idea = idea {
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Header with gradient
                        ZStack(alignment: .topLeading) {
                            stageGradient(for: idea.stageGate)
                                .frame(height: 120)
                                .cornerRadius(16)
                            
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text("#\(idea.ideaNumber)")
                                        .font(.caption)
                                        .fontWeight(.semibold)
                                        .foregroundColor(.white.opacity(0.9))
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color.white.opacity(0.2))
                                        .cornerRadius(12)
                                    
                                    Spacer()
                                    
                                    Text(idea.stageGate.displayName)
                                        .font(.subheadline)
                                        .fontWeight(.medium)
                                        .foregroundColor(.white)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color.white.opacity(0.2))
                                        .cornerRadius(12)
                                }
                                
                                Spacer()
                                
                                Text(idea.title)
                                    .font(.title2)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }
                            .padding()
                        }
                        
                        // Description
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Description")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            Text(idea.description)
                                .font(.body)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                        
                        // Opportunity
                        if let opportunity = idea.opportunity {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Opportunity")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                HStack(spacing: 8) {
                                    Text("💰")
                                        .font(.title3)
                                    Text(opportunity)
                                        .font(.body)
                                        .fontWeight(.medium)
                                        .foregroundColor(.green)
                                }
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.green.opacity(0.1))
                            .cornerRadius(12)
                        }
                        
                        // Tags
                        if !idea.tagArray.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Tags")
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                FlowLayout(spacing: 8) {
                                    ForEach(idea.tagArray, id: \.self) { tag in
                                        Text(tag)
                                            .font(.subheadline)
                                            .foregroundColor(.blue)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 6)
                                            .background(Color.blue.opacity(0.1))
                                            .cornerRadius(16)
                                    }
                                }
                            }
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.white)
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                        }
                        
                        // Metadata
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Image(systemName: "calendar")
                                    .foregroundColor(.secondary)
                                Text("Created: \(idea.createdAt, style: .date)")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            
                            if !idea.collaborators.isEmpty {
                                HStack {
                                    Image(systemName: "person.2")
                                        .foregroundColor(.secondary)
                                    Text("\(idea.collaborators.count + 1) collaborators")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                        
                        // Action Buttons
                        HStack(spacing: 12) {
                            Button(action: { showEditSheet = true }) {
                                Label("Edit", systemImage: "pencil")
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(
                                        LinearGradient(
                                            colors: [.blue, .purple],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                            }
                            
                            Button(action: { showDeleteAlert = true }) {
                                Label("Delete", systemImage: "trash")
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.red)
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                            }
                        }
                    }
                    .padding()
                }
                .background(Color(UIColor.systemGroupedBackground))
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await loadIdea()
        }
        .alert("Delete Idea", isPresented: $showDeleteAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Delete", role: .destructive) {
                Task {
                    await deleteIdea()
                }
            }
        } message: {
            Text("Are you sure you want to delete this idea? This action cannot be undone.")
        }
    }
    
    private func loadIdea() async {
        do {
            idea = try await APIService.shared.getIdea(id: ideaId)
        } catch {
            print("Error loading idea: \(error)")
        }
        isLoading = false
    }
    
    private func deleteIdea() async {
        do {
            try await APIService.shared.deleteIdea(id: ideaId)
            dismiss()
        } catch {
            print("Error deleting idea: \(error)")
        }
    }
    
    private func stageGradient(for stage: StageGate) -> LinearGradient {
        switch stage {
        case .idea:
            return LinearGradient(colors: [Color(red: 0.4, green: 0.5, blue: 0.92), Color(red: 0.46, green: 0.29, blue: 0.64)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .inDevelopment:
            return LinearGradient(colors: [Color(red: 0.98, green: 0.44, blue: 0.6), Color(red: 0.96, green: 0.84, blue: 0.25)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .launched:
            return LinearGradient(colors: [Color(red: 0.26, green: 0.91, blue: 0.48), Color(red: 0.22, green: 0.98, blue: 0.84)], startPoint: .topLeading, endPoint: .bottomTrailing)
        case .sidelined:
            return LinearGradient(colors: [Color.gray, Color.gray.opacity(0.7)], startPoint: .topLeading, endPoint: .bottomTrailing)
        }
    }
}

// Simple flow layout for tags
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = FlowResult(in: proposal.replacingUnspecifiedDimensions().width, subviews: subviews, spacing: spacing)
        return result.size
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let result = FlowResult(in: bounds.width, subviews: subviews, spacing: spacing)
        for (index, subview) in subviews.enumerated() {
            subview.place(at: CGPoint(x: bounds.minX + result.positions[index].x, y: bounds.minY + result.positions[index].y), proposal: .unspecified)
        }
    }
    
    struct FlowResult {
        var size: CGSize = .zero
        var positions: [CGPoint] = []
        
        init(in maxWidth: CGFloat, subviews: Subviews, spacing: CGFloat) {
            var x: CGFloat = 0
            var y: CGFloat = 0
            var lineHeight: CGFloat = 0
            
            for subview in subviews {
                let size = subview.sizeThatFits(.unspecified)
                
                if x + size.width > maxWidth && x > 0 {
                    x = 0
                    y += lineHeight + spacing
                    lineHeight = 0
                }
                
                positions.append(CGPoint(x: x, y: y))
                lineHeight = max(lineHeight, size.height)
                x += size.width + spacing
            }
            
            self.size = CGSize(width: maxWidth, height: y + lineHeight)
        }
    }
}
