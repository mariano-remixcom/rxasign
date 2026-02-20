<template>
  <div>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>
    <div id="exampleModal" class="modal" tabindex="-1">
      <div class="modal-dialog fit-content">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <h5 class="modal-title">Repetir tarea</h5>
              <div class="modal-subtitle">
                <span id="task-type">{{ task.type }}</span>
                -
                <span id="task-description">{{ task.description }}</span>
              </div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex gap-3 mx-3 mb-3">
              <div class="form-group">
                <label for="from-date" class="mb-1">Desde</label>
                <input
                  id="from-date"
                  v-model="fromDate"
                  class="form-control bg-white"
                  type="date"
                  required
                  @change="updateFromDate"
                />
              </div>
              <div class="form-group">
                <label for="to-date" class="mb-1">Hasta</label>
                <input
                  id="to-date"
                  v-model="toDate"
                  class="form-control bg-white"
                  type="date"
                  required
                  @change="updateToDate"
                />
              </div>
            </div>

            <div class="d-flex gap-3 mx-3 mb-3">
              <input class="form-check-input" type="checkbox" value="" />
              <label class="form-check-label">L</label>
              <input class="form-check-input" type="checkbox" value="" />
              <label class="form-check-label">M</label>
              <input class="form-check-input" type="checkbox" value="" />
              <label class="form-check-label">M</label>
              <input class="form-check-input" type="checkbox" value="" />
              <label class="form-check-label">J</label>
              <input class="form-check-input" type="checkbox" value="" />
              <label class="form-check-label">V</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RepeatTaskModal',
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>
