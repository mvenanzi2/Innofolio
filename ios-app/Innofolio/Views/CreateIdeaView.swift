import SwiftUI

struct CreateIdeaView: View {
    @Environment(\.dismiss) var dismiss
    let onCreated: () async -> Void
    
    @State private var title = ""
    @State private var description = ""
    @State private var opportunity = ""
    @State private var tags = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(UIColor.systemGroupedBackground)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Title")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                            TextField("Enter idea title", text: $title)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Description")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                            TextEditor(text: $description)
                                .frame(height: 120)
                                .padding(8)
                                .background(Color.white)
                                .cornerRadius(12)
                                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("$ Opportunity (optional)")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                            TextField("e.g., $50,000 annual savings", text: $opportunity)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Tags (optional)")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.secondary)
                            TextField("e.g., travel, cost-saving", text: $tags)
                                .textFieldStyle(CustomTextFieldStyle())
                            Text("Separate multiple tags with commas")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        if let error = errorMessage {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                                .padding()
                                .background(Color.red.opacity(0.1))
                                .cornerRadius(8)
                        }
                        
                        Button(action: handleCreate) {
                            if isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Create Idea")
                                    .font(.headline)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(
                            LinearGradient(
                                colors: [.blue, .purple],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .disabled(isLoading || title.isEmpty || description.isEmpty)
                        .opacity((title.isEmpty || description.isEmpty) ? 0.6 : 1.0)
                    }
                    .padding()
                }
            }
            .navigationTitle("New Idea")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func handleCreate() {
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                _ = try await APIService.shared.createIdea(
                    title: title,
                    description: description,
                    opportunity: opportunity.isEmpty ? nil : opportunity,
                    tags: tags.isEmpty ? nil : tags
                )
                await onCreated()
                dismiss()
            } catch {
                errorMessage = error.localizedDescription
            }
            isLoading = false
        }
    }
}
