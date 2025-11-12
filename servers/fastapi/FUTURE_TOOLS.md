# Future MCP Tools - TODO List

## High Priority (Implement First)

### 1. duplicate_slide ⭐
**Use Case**: Copy a slide and modify it
**Complexity**: Low
**Implementation**:
- Get slide by ID
- Create new slide with same content
- Generate new UUID
- Insert at specified position
- Update presentation

### 2. search_presentations ⭐
**Use Case**: Find presentations without listing all
**Complexity**: Medium
**Implementation**:
- Search by title
- Search by content
- Return metadata only (token efficient)
- Support pagination

### 3. get_slide_layouts ⭐
**Use Case**: Help users discover available layouts
**Complexity**: Low
**Implementation**:
- List all layout templates
- Group by category (general, comparison, data, etc.)
- Include preview/description
- Return layout IDs for use in add_slide

### 4. clone_presentation ⭐
**Use Case**: Create copy of entire presentation
**Complexity**: Medium
**Implementation**:
- Get full presentation
- Create new presentation with same metadata
- Copy all slides with new UUIDs
- Maintain slide order

## Medium Priority (Implement Second)

### 5. copy_slide_to_presentation
**Use Case**: Move slides between presentations
**Complexity**: Medium
**Implementation**:
- Get slide from source
- Add to target presentation
- Optional: remove from source (move vs copy)

### 6. bulk_edit_slides
**Use Case**: Edit multiple slides at once with AI
**Complexity**: High (API calls)
**Implementation**:
- Accept list of slide IDs
- Apply same prompt to all
- Process in parallel or sequence
- Return results for each

### 7. get_presentation_metadata
**Use Case**: Token-efficient metadata retrieval
**Complexity**: Low
**Implementation**:
- Return only: title, id, n_slides, created_at, updated_at
- No slide content
- Much smaller response than get_presentation

## Low Priority (Nice to Have)

### 8. merge_presentations
**Use Case**: Combine multiple presentations
**Complexity**: High
**Implementation**:
- Get all presentations
- Merge slides in order
- Re-index all slides
- Create new presentation

### 9. update_slide_order
**Use Case**: Reorder multiple slides at once
**Complexity**: Medium
**Note**: Already have move_slide for single slides
**Implementation**:
- Accept array of slide IDs in desired order
- Re-index all slides
- Update presentation

### 10. get_export_status
**Use Case**: Check export progress for large files
**Complexity**: Medium
**Implementation**:
- Track export jobs
- Return status: pending, processing, complete, failed
- Include download URL when ready

## Implementation Notes

### API Endpoints to Create
```
POST   /api/v1/ppt/slide/duplicate
POST   /api/v1/ppt/slide/copy-to-presentation
GET    /api/v1/ppt/layouts
POST   /api/v1/ppt/presentation/search
POST   /api/v1/ppt/presentation/clone
POST   /api/v1/ppt/presentation/merge
GET    /api/v1/ppt/presentation/{id}/metadata
POST   /api/v1/ppt/slides/bulk-edit
PATCH  /api/v1/ppt/presentation/{id}/slide-order
GET    /api/v1/ppt/export/{id}/status
```

### Testing Checklist
- [ ] Unit tests for each endpoint
- [ ] Integration tests with MCP server
- [ ] Token usage analysis
- [ ] Performance benchmarks
- [ ] Error handling
- [ ] Documentation

### Estimated Impact
| Tool | User Value | Dev Effort | Token Savings | Priority |
|------|-----------|------------|---------------|----------|
| duplicate_slide | High | Low | Medium | 1 |
| search_presentations | High | Medium | High | 1 |
| get_slide_layouts | High | Low | Low | 1 |
| clone_presentation | Medium | Medium | None | 1 |
| copy_slide_to_presentation | Medium | Medium | None | 2 |
| bulk_edit_slides | High | High | Medium | 2 |
| get_presentation_metadata | Medium | Low | High | 2 |
| merge_presentations | Low | High | None | 3 |
| update_slide_order | Low | Medium | None | 3 |
| get_export_status | Low | Medium | Low | 3 |

## Next Steps
1. Implement duplicate_slide (easiest, high value)
2. Add search_presentations (high value)
3. Create get_slide_layouts (enables discovery)
4. Test with real workflows
5. Gather user feedback
6. Iterate based on usage patterns
